import { action, makeObservable, observable } from "mobx";
import type { Project } from "../database/dbInterfaces";
import { fetchProjects, fetchProjectWithImagesById } from "../database/FirebaseDb";
import { logException } from "../utilities/exceptionUtils";
// import type { ScrollAreaType } from "../utilities/useImageScrolling";

export type ScrollParameters = {
  mainScrollValue?: number,
  imagesScrollValues?: [number, number, number],
  shouldUpdateImages?: boolean,
  //scrollAreaType?: ScrollAreaType
}



class ProjectsStore {

  // observable
  projects: Project[] = [];

  scrollParameters: ScrollParameters = { };

  setScrollParameters = (update: Readonly<Partial<ScrollParameters>>): undefined => {
    this.scrollParameters = {
      ...this.scrollParameters,
      ...update,
    };
  }

  constructor() {
    makeObservable(this, {
      projects: observable,
      scrollParameters: observable,
      setScrollParameters: action
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