import ProjectClient from './ProjectClient';

type Props = {
    params: { id: string }
}

export default function ProjectPage({ params }: Props) {
    return <ProjectClient id={params.id} />;
}