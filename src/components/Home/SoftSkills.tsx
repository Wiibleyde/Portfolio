import { useTranslations } from 'next-intl'
import { SkillCard, SkillProps } from './SkillCard';

import Communication from '@public/img/softskills/communication.svg';
import ProblemSolving from '@public/img/softskills/problemSolving.svg';
import Empathy from '@public/img/softskills/empathy.svg';
import TimeManagement from '@public/img/softskills/timeManagment.svg';
import Priorisation from '@public/img/softskills/priorisation.svg';
import Adaptability from '@public/img/softskills/adaptability.svg';
import Innovation from '@public/img/softskills/innovation.svg';
import CriticalThinking from '@public/img/softskills/criticalThinking.svg';
import Curiosity from '@public/img/softskills/curiosity.svg';

interface SoftSkillsCategory {
    title: string;
    stacks: SkillProps[];
}

export function SoftSkills() {
    const t = useTranslations('SoftSkills')

    const softSkills: SoftSkillsCategory[] = [
        {
            title: t('teamwork'),
            stacks: [
                { title: t('teamworkSub.communication'), image: Communication },
                { title: t('teamworkSub.problemSolving'), image: ProblemSolving },
                { title: t('teamworkSub.empathy'), image: Empathy },
            ]
        },
        {
            title: t('organization'),
            stacks: [
                { title: t('organizationSub.timeManagement'), image: TimeManagement },
                { title: t('organizationSub.prioritization'), image: Priorisation },
                { title: t('organizationSub.adaptability'), image: Adaptability },
            ]
        },
        {
            title: t('creativity'),
            stacks: [
                { title: t('creativitySub.innovation'), image: Innovation },
                { title: t('creativitySub.criticalThinking'), image: CriticalThinking },
                { title: t('creativitySub.curiosity'), image: Curiosity },
            ]
        }
    ]

    return (
        <div className='flex flex-col space-y-9'>
            {softSkills.map(({ title, stacks }) => (
                <div key={title} className='flex flex-col space-y-3'>
                    <h2 className='text-gray-100 text-3xl font-semibold text-center'>{title}</h2>
                    <div className='flex flex-wrap space-x-9 justify-center'>
                        {stacks.map(({ title, image, url }, index) => (
                            <SkillCard key={index} title={title} image={image} url={url} />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    )
}