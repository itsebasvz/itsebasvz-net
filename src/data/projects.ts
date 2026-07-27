import { getCollection } from "astro:content";

export async function getPublicProjects() {
  const projects = await getCollection(
    "projects",
    ({ data }) => data.publishState === "ready"
  );

  return projects.toSorted((left, right) => left.data.order - right.data.order);
}

export async function getFeaturedProjects() {
  const projects = await getPublicProjects();

  return projects.filter(({ data }) => data.featured);
}
