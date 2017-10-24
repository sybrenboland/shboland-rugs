import {Pom} from "@atomist/rug/model/Pom";
import {Project} from "@atomist/rug/model/Project";
import {Editor, Parameter, Tags} from "@atomist/rug/operations/Decorators";
import {EditProject} from "@atomist/rug/operations/ProjectEditor";
import {Pattern} from "@atomist/rug/operations/RugOperation";
import {PathExpressionEngine} from "@atomist/rug/tree/PathExpression";

/**
 * SetSpringBootVersion editor
 * - Sets spring boot version of maven parent
 */
@Editor("SetSpringBootVersion", "sets spring boot version")
@Tags("rug", "spring", "boot", "shboland")
export class SetSpringBootVersion implements EditProject {
    @Parameter({
        displayName: "Version",
        description: "Version of Spring Boot",
        pattern: Pattern.any,
        validInput: "Release number",
        minLength: 0,
        maxLength: 100,
        required: false,
    })
    public version: string = "1.5.3.RELEASE";

    public edit(project: Project) {
        this.setVersionBootParent(project);
    }

    private setVersionBootParent(project: Project): void {
        const eng: PathExpressionEngine = project.context.pathExpressionEngine;

        eng.with<Pom>(project, "/Pom()", pom => {
            pom.setParentVersion(this.version);
        });
    }
}

export const setSpringBootVersion = new SetSpringBootVersion();
