import Project from './Project';

export default async function ProjectPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const resolvedParams = await params;
    return <Project id={resolvedParams.id} />;
}