import { Project } from "@atomist/rug/model/Project";
import { Editor, Parameter, Tags } from "@atomist/rug/operations/Decorators";
import { EditProject } from "@atomist/rug/operations/ProjectEditor";
import { Pattern } from "@atomist/rug/operations/RugOperation";

/**
 * AddLiquibaseFields editor
 * - Adds fields to liquibase changeset
 */
@Editor("AddLiquibaseFields", "adds fields to liquibase changeset")
@Tags("rug", "liquibase", "field", "bean", "shboland")
export class AddLiquibaseFields implements EditProject {
    public edit(project: Project) {

    }
}

export const addLiquibaseFields = new AddLiquibaseFields();
