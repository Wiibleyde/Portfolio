"use client"
import { Book, Briefcase, Calendar, HeartFill, Icon } from "react-bootstrap-icons";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

interface Timeline {
    title: string;
    duration: string;
    org: string;
    icon?: Icon;
    description?: string;
    skills: string[];
    class: string;
    circleColor?: string;
    ringColor?: string;
}

export function Timeline() {
    const t = useTranslations("Timeline");

    const data: Timeline[] = [
        {
            "title": t("1.title"),
            "duration": t("1.duration"),
            "org": t("1.org"),
            "icon": Briefcase,
            "description": t("1.description"),
            "skills": [t("1.skills.0"), t("1.skills.1"), t("1.skills.2"), t("1.skills.3"), t("1.skills.4")],
            "class": "text-sm font-medium me-2 px-2.5 py-0.5 rounded bg-red-900 text-red-300",
            "circleColor": "bg-red-900",
            "ringColor": "ring-red-900"
        },
        {
            "title": t("2.title"),
            "duration": t("2.duration"),
            "org": t("2.org"),
            "description": t("2.description"),
            "skills": [t("2.skills.0"), t("2.skills.1"), t("2.skills.2"), t("2.skills.3"), t("2.skills.4"), t("2.skills.5")],
            "class": "bg-blue-100 text-blue-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300",
            "circleColor": "bg-blue-900",
            "ringColor": "ring-blue-900"
        },
        {
            "title": t("3.title"),
            "duration": t("3.duration"),
            "org": t("3.org"),
            "icon": HeartFill,
            "description": t("3.description"),
            "skills": [t("3.skills.0"), t("3.skills.1"), t("3.skills.2")],
            "class": "text-sm font-medium me-2 px-2.5 py-0.5 rounded bg-yellow-900 text-yellow-300",
            "circleColor": "bg-yellow-900",
            "ringColor": "ring-yellow-900"
        },
        {
            "title": t("4.title"),
            "duration": t("4.duration"),
            "org": t("4.org"),
            "description": t("4.description"),
            "icon": Book,
            "skills": [t("4.skills.0"), t("4.skills.1"), t("4.skills.2")],
            "class": "text-sm font-medium me-2 px-2.5 py-0.5 rounded bg-green-900 text-green-300",
            "circleColor": "bg-green-900",
            "ringColor": "ring-green-900"
        },
    ]

    return (
        <div>
            <ol className="relative border-s border-gray-700">
                {data.map((item) => (
                    <TimelineItem key={item.title} item={item} index={data.indexOf(item)} />
                ))}
            </ol>
        </div>
    );
}

function TimelineItem({ item, index }: { item: Timeline; index: number }) {
    const t = useTranslations("Timeline");

    return (
        <motion.li
            className="mb-10 ms-6"
            initial={{ opacity: 0, y: 0 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
        >
            <span className={`absolute flex items-center justify-center w-6 h-6 rounded-full -start-3 ring-8 ring-opacity-45 ${item.ringColor} ${item.circleColor}`}>
                {item.icon ? <item.icon className={"text-white w-3.5 h-3.5"} /> : <Calendar className={"text-white w-2.5 h-2.5"} />}
            </span>
            <h3 className="flex items-center mb-1 lg:text-lg text-sm font-semibold dark:text-white">
                {item.title}
                {index === 0 && (
                    <span className="bg-red-500 text-[#fff] text-sm font-medium me-2 px-2.5 py-0.5 border-sky-100 rounded ms-3">
                        {t("latest")}
                    </span>
                )}
            </h3>
            <time className="block mb-2 text-sm font-normal leading-none text-gray-500">
                {item.duration}
            </time>
            <p className="lg:text-lg text-sm">{item.org}</p>
            <span className="lg:text-lg text-sm">{item.description && <p>{item.description}</p>}</span>
            <div className="flex flex-wrap mt-8">
                {item.skills.map((skill, idx) => (
                    <span key={idx} className={item.class}>
                        {skill}
                    </span>
                ))}
            </div>
        </motion.li>
    )
}