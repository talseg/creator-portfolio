import { action, makeAutoObservable, makeObservable, observable, runInAction } from "mobx";
import type { Project } from "../database/dbInterfaces";
import { fetchProjects, fetchProjectWithImagesById } from "../database/FirebaseDb";
import { logException } from "../utilities/exceptionUtils";

class ProjectsStore {

  // observable
  projects: Project[] = [];

  mainScrollValue: number = 0;
  imagesScrollValues: [number, number, number] = [0, 0, 0];
  allLoaded: boolean = false;

  setMainScrollValue = (value: number) => {
    this.mainScrollValue = value;
  }
  setImageScrollValues = (value: [number, number, number]) => {
    this.imagesScrollValues = value;
  }

  constructor() {
    makeObservable(this, {
      projects: observable,
      mainScrollValue: observable,
      imagesScrollValues: observable,
      allLoaded: observable,
      setMainScrollValue: action,
      setImageScrollValues: action
    });
    this.init();
  }

  private init = async () => {
    await this.loadProjects();
    await this.fetchAllProjectsImages();
    runInAction(() => {
      this.allLoaded = true;
      // console.log("store setting allLoaded to true")
    });
  }

  private loadProjects = async () => {
    try {
      const projs = await fetchProjects();
      runInAction(() => {
      this.projects = projs.map((proj) => makeAutoObservable(proj));
      })
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
          
          runInAction(() => {
            project.images = projectWithImages.images;
          });
        }
      })
    );
  };
}

export const projectsStore = new ProjectsStore();