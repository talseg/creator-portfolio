import { makeObservable, observable } from "mobx";
import type { Project } from "../database/dbInterfaces";
import { fetchProjects, fetchProjectWithImagesById } from "../database/FirebaseDb";
import { logException } from "../utilities/exceptionUtils";

class ProjectsStore {

  // observable
  projects: Project[] = [];

  constructor() {
    makeObservable(this, {
      projects: observable,
    });
    this.init();
  }

  private init = async () => {
    await this.loadProjects();
    await this.fetchAllProjectsImages();
  }

  private loadProjects = async () => {
    try {
      this.projects = await fetchProjects();
    } catch (err) {
      logException(err);
    }
  }

  private fetchAllProjectsImages = async () => {
    await Promise.all(
      this.projects.map(async (project) => {
        if (!project.images || project.images.length === 0) {
          const projectWithImages =
            await fetchProjectWithImagesById(project.id);
          project.images = projectWithImages.images;
        }
      })
    );
  };
}

export const projectsStore = new ProjectsStore();