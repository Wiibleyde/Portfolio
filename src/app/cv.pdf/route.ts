import { readFile } from 'node:fs/promises';
import path from 'node:path';
import fontkit from '@pdf-lib/fontkit';
import { PDFDocument, type PDFFont, type PDFPage, type RGB, rgb, setCharacterSpacing } from 'pdf-lib';
import sharp from 'sharp';
import { profile } from '@/data/profile';
import { projects } from '@/data/projects';
import { type TimelineEntry, timeline } from '@/data/timeline';
import type { Project } from '@/types';

// built once at build time from the site data
export const dynamic = 'force-static';

const PAGE: [number, number] = [595.28, 841.89]; // A4
const MARGIN = 40;
const BOTTOM = 24;
const RIGHT = PAGE[0] - MARGIN;
const GUTTER = 78; // left column for dates, like the site timeline
const CONTENT_X = MARGIN + GUTTER;
const RAIL_X = CONTENT_X - 13;
const PHOTO = 78;
const COLUMN_GAP = 14;

const hex = (value: string) => {
    const n = Number.parseInt(value.slice(1), 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((c) => c / 255) as [number, number, number];
};
const color = (value: string) => rgb(...hex(value));
// site palette (zinc + accent) flipped for paper: the accent is darkened to stay readable on white
const ZINC_950 = color('#09090b');
const ZINC_700 = color('#3f3f46');
const ZINC_500 = color('#71717a');
const ZINC_300 = color('#d4d4d8');
const ZINC_200 = color('#e4e4e7');
const ZINC_50 = color('#fafafa');
const WHITE = color('#ffffff');
const ACCENT = color('#2f5bd3');

const clean = (text: string) =>
    text
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
        .replace(/\p{Extended_Pictographic}/gu, '')
        .replace(/\s+([).,])/g, '$1')
        .replace(/\s{2,}/g, ' ')
        .trim();

const normalize = (text: string) => text.toLowerCase().replace(/[^a-z0-9]/g, '');

// "Septembre 2024 - Août 2025" -> "2024 – 2025", "… - Aujourd'hui" -> "2025 – auj."
const years = (duration: string) => {
    const [start, end] = duration.split(' - ');
    const year = (part = '') => part.match(/\d{4}/)?.[0] ?? (/aujourd/i.test(part) ? 'auj.' : part);
    return end ? `${year(start)} – ${year(end)}` : year(start);
};

const roundedRect = (w: number, h: number, r: number) =>
    `M${r},0 H${w - r} Q${w},0 ${w},${r} V${h - r} Q${w},${h} ${w - r},${h} H${r} Q0,${h} 0,${h - r} V${r} Q0,0 ${r},0 Z`;

function wrap(text: string, font: PDFFont, size: number, width: number) {
    const lines: string[] = [];
    let current = '';
    for (const word of text.split(' ')) {
        const next = current ? `${current} ${word}` : word;
        if (current && font.widthOfTextAtSize(next, size) > width) {
            lines.push(current);
            current = word;
        } else {
            current = next;
        }
    }
    if (current) lines.push(current);
    return lines;
}

const fontFile = (file: string) => readFile(path.join(process.cwd(), 'node_modules/geist/dist/fonts', file));

export async function GET() {
    const doc = await PDFDocument.create();
    doc.registerFontkit(fontkit);
    const [regular, medium, semibold, mono] = await Promise.all(
        [
            'geist-sans/Geist-Regular.ttf',
            'geist-sans/Geist-Medium.ttf',
            'geist-sans/Geist-SemiBold.ttf',
            'geist-mono/GeistMono-Regular.ttf',
        ].map(async (file) => doc.embedFont(await fontFile(file), { subset: true })),
    );

    // rounded corners baked into the image, no clipping path needed
    const mask = Buffer.from('<svg width="320" height="320"><rect width="320" height="320" rx="44"/></svg>');
    const photoPng = await sharp(path.join(process.cwd(), 'public/img/pp.webp'))
        .resize(320, 320)
        .composite([{ input: mask, blend: 'dest-in' }])
        .png()
        .toBuffer();
    const photo = await doc.embedPng(photoPng);

    let page: PDFPage = doc.addPage(PAGE);
    let y = PAGE[1] - MARGIN;
    // current column: text wraps between textX and right, rules span left to right
    let left = MARGIN;
    let right = RIGHT;
    let textX = MARGIN;

    const ensure = (height: number) => {
        if (y - height >= BOTTOM) return;
        page = doc.addPage(PAGE);
        y = PAGE[1] - MARGIN;
    };

    const within = (l: number, r: number, x: number, draw: () => void) => {
        const saved = [left, right, textX];
        [left, right, textX] = [l, r, x];
        draw();
        [left, right, textX] = saved;
    };

    // lays cells out side by side, each row continues below its tallest cell
    // shortcut: a row never breaks across pages, fine while the CV fits on one page
    const grid = (
        count: number,
        cells: (() => void)[],
        frame?: (x: number, w: number, top: number, h: number) => void,
    ) => {
        const w = (right - left - COLUMN_GAP * (count - 1)) / count;
        for (let i = 0; i < cells.length; i += count) {
            if (i) y -= COLUMN_GAP * 0.7;
            const top = y;
            let bottom = y;
            cells.slice(i, i + count).forEach((cell, j) => {
                y = top;
                const x = left + j * (w + COLUMN_GAP);
                within(x, x + w, x, cell);
                bottom = Math.min(bottom, y);
            });
            for (let j = 0; frame && j < Math.min(count, cells.length - i); j++) {
                frame(left + j * (w + COLUMN_GAP), w, top, top - bottom);
            }
            y = bottom;
        }
    };

    const text = (value: string, x: number, at: number, font: PDFFont, size: number, tint: RGB, spacing = 0) => {
        if (spacing) page.pushOperators(setCharacterSpacing(spacing));
        page.drawText(value, { x, y: at, size, font, color: tint });
        if (spacing) page.pushOperators(setCharacterSpacing(0));
        return font.widthOfTextAtSize(value, size) + spacing * value.length;
    };

    const textRight = (value: string, edge: number, at: number, font: PDFFont, size: number, tint: RGB) =>
        text(value, edge - font.widthOfTextAtSize(value, size), at, font, size, tint);

    const paragraph = (value: string, font = regular, size = 9, tint = ZINC_700, lineHeight = 1.38) => {
        for (const line of wrap(clean(value), font, size, right - textX)) {
            ensure(size * lineHeight);
            y -= size * lineHeight;
            text(line, textX, y + size * 0.3, font, size, tint);
        }
    };

    // same look as the site's `.tag`: mono, 1px border, small radius
    const tags = (values: string[]) => {
        const size = 7;
        const padX = 4.5;
        const h = 11;
        let x = textX;
        y -= 3.5;
        ensure(h);
        for (const value of values) {
            const w = mono.widthOfTextAtSize(value, size) + padX * 2;
            if (x + w > right) {
                x = textX;
                y -= h + 3;
                ensure(h);
            }
            // svg paths are drawn with y pointing down from (x, y)
            page.drawSvgPath(roundedRect(w, h, 3), { x, y, color: ZINC_50, borderColor: ZINC_200, borderWidth: 0.6 });
            text(value, x + padX, y - h + 3.2, mono, size, ZINC_700);
            x += w + 3;
        }
        y -= h;
    };

    // the timeline rail is drawn piece by piece between markers so markers stay on top
    let lastMarker: { page: PDFPage; y: number } | null = null;

    const heading = (title: string) => {
        y -= 10;
        ensure(52); // keep a heading with the start of its section
        page.drawLine({ start: { x: left, y }, end: { x: right, y }, thickness: 0.6, color: ZINC_200 });
        y -= 15;
        text(title, left, y, semibold, 12, ZINC_950, -0.2);
        y -= 1;
        lastMarker = null;
    };

    // full width: dates in the gutter, a rail with one marker per step, content on the right
    const timelineEntry = (item: TimelineEntry) =>
        within(MARGIN, RIGHT, CONTENT_X, () => {
            y -= 6;
            ensure(30);
            y -= 10;
            textRight(years(item.duration), RAIL_X - 10, y + 0.5, mono, 7.5, ZINC_500);
            const width = text(clean(item.cvTitle ?? item.title), CONTENT_X, y, semibold, 10, ZINC_950);
            text(` · ${clean(item.org)}`, CONTENT_X + width, y, medium, 10, ACCENT);

            const markerY = y + 3.5;
            const r = 3.2;
            if (lastMarker?.page === page) {
                page.drawLine({
                    start: { x: RAIL_X, y: lastMarker.y - r },
                    end: { x: RAIL_X, y: markerY + r },
                    thickness: 0.8,
                    color: ZINC_200,
                });
            }
            // current roles get the accent, like the lit steps of the site timeline
            const tint = item.isNow ? ACCENT : ZINC_300;
            page.drawCircle({ x: RAIL_X, y: markerY, size: r, color: WHITE, borderColor: tint, borderWidth: 0.9 });
            if (item.isNow) page.drawCircle({ x: RAIL_X, y: markerY, size: 1.3, color: ACCENT });
            lastMarker = { page, y: markerY };
            y -= 1.5;

            if (item.description) paragraph(item.description);
            // pills for tech stacks, a plain line for school subjects, soft skills are left off the CV
            if (item.kind === 'work') tags(item.skills);
            if (item.kind === 'education') paragraph(item.skills.join('  ·  '), regular, 8.5, ZINC_500);
        });

    // narrow column: the date moves above the title
    const compactEntry = (item: TimelineEntry) => {
        y -= 13;
        text(years(item.duration), textX, y, mono, 7, ZINC_500);
        y -= 1;
        paragraph(item.cvTitle ?? item.title, semibold, 9.5, ZINC_950, 1.3);
        paragraph(item.org, medium, 9, ACCENT, 1.3);
        if (item.description) paragraph(item.description, regular, 8.5);
    };

    // a bordered card, like the site's project grid
    const projectCard = (project: Project) => () => {
        const pad = 8;
        const link = (project.url ?? project.repoUrl)?.replace(/^https?:\/\//, '').replace(/\/$/, '');
        within(left + pad, right - pad, left + pad, () => {
            y -= pad + 6.5;
            text(project.type, left, y, mono, 6.5, ZINC_500);
            if (link) textRight(link, right, y, mono, 6.5, ZINC_500);
            y -= 2;
            paragraph(clean(project.title), semibold, 10, ZINC_950, 1.3);
            paragraph(project.description, regular, 8.5, ZINC_700, 1.35);
            // site tags double as keywords: skip the ones repeating the project name, keep the card short
            tags(project.tags.filter((tag) => !normalize(project.title).includes(normalize(tag))).slice(0, 4));
            y -= pad;
        });
    };

    // header: photo next to the name, dot grid fading out from the top-right corner like the hero's DotGrid
    const top = PAGE[1] - MARGIN;
    const photoX = MARGIN;
    const photoY = top - PHOTO;
    const center = { x: PAGE[0], y: PAGE[1] };
    const [dotR, dotG, dotB] = hex('#d4d4d8');
    for (let dx = PAGE[0] - 12; dx > PAGE[0] * 0.35; dx -= 9) {
        for (let dy = PAGE[1] - 12; dy > photoY - 22; dy -= 9) {
            const fade = 1 - Math.hypot(dx - center.x, dy - center.y) / 260;
            if (fade <= 0.05) continue;
            const mix = (c: number) => 1 - (1 - c) * fade;
            page.drawCircle({ x: dx, y: dy, size: 0.75, color: rgb(mix(dotR), mix(dotG), mix(dotB)) });
        }
    }
    page.drawImage(photo, { x: photoX, y: photoY, width: PHOTO, height: PHOTO });
    page.drawSvgPath(roundedRect(PHOTO, PHOTO, (44 / 320) * PHOTO), {
        x: photoX,
        y: top,
        borderColor: ZINC_200,
        borderWidth: 1,
    });

    const headerX = photoX + PHOTO + 18;
    text(`${profile.headline} · ${profile.location}`, headerX, top - 10, regular, 9.5, ZINC_500);
    text(profile.name, headerX, top - 40, semibold, 28, ZINC_950, -0.3);
    text([profile.email, profile.phone].join('  ·  '), headerX, top - 58, regular, 9, ZINC_700);
    text(profile.links.join('  ·  '), headerX, top - 72, regular, 9, ACCENT);
    y = photoY - 10;

    paragraph(profile.summary, regular, 9.5);

    heading('Compétences');
    grid(
        3,
        profile.skills.map(({ label, items }) => () => {
            y -= 13;
            text(label, left, y, medium, 9, ZINC_950);
            y -= 1;
            paragraph(items.join('  ·  '), regular, 8.5, ZINC_700, 1.38);
        }),
    );

    heading('Expérience');
    for (const item of timeline.filter((t) => t.kind === 'work')) timelineEntry(item);

    heading('Projets');
    y -= 8;
    grid(3, projects.filter((p) => p.cv).map(projectCard), (x, w, top, h) =>
        page.drawSvgPath(roundedRect(w, h, 6), { x, y: top, borderColor: ZINC_200, borderWidth: 0.6 }),
    );

    heading('Formation');
    grid(
        2,
        timeline.filter((t) => t.kind === 'education').map((item) => () => compactEntry(item)),
    );

    const volunteering = timeline.filter((t) => t.kind === 'volunteer');
    y -= 2;
    grid(3, [
        () => {
            heading('Engagement');
            for (const item of volunteering) compactEntry(item);
        },
        () => {
            heading('Langues');
            y -= 3;
            for (const language of profile.languages) paragraph(language, regular, 9, ZINC_700, 1.45);
        },
        () => {
            heading("Centres d'intérêt");
            y -= 3;
            for (const interest of profile.interests) paragraph(interest, regular, 9, ZINC_700, 1.45);
        },
    ]);

    const updated = new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
    for (const p of doc.getPages()) {
        p.drawText(`Généré depuis ${profile.links[0]} · ${updated}`, {
            x: MARGIN,
            y: 14,
            size: 6.5,
            font: mono,
            color: ZINC_500,
        });
    }
    if (doc.getPageCount() > 1) console.warn(`cv.pdf: content overflows to ${doc.getPageCount()} pages`);

    doc.setTitle(`CV ${profile.name}`);
    doc.setAuthor(profile.name);
    doc.setSubject(profile.headline);
    doc.setKeywords(profile.skills.flatMap((group) => group.items));
    doc.setLanguage('fr-FR');
    doc.setCreator(profile.links[0]);

    return new Response(new Uint8Array(await doc.save()), {
        headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `inline; filename="CV ${profile.name}.pdf"`,
        },
    });
}
