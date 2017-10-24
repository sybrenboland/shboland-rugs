import {File} from "@atomist/rug/model/File";
import {Pom} from "@atomist/rug/model/Pom";
import {Project} from "@atomist/rug/model/Project";
import {Editor, Parameter, Tags} from "@atomist/rug/operations/Decorators";
import {EditProject} from "@atomist/rug/operations/ProjectEditor";
import {Pattern} from "@atomist/rug/operations/RugOperation";
import {PathExpressionEngine} from "@atomist/rug/tree/PathExpression";
import {fileFunctions} from "./FileFunctions";
import {javaFunctions} from "./JavaClassFunctions";

/**
 * AddLombok editor
 * - Adds maven dependencies
 * - Adds imports
 * - Adds Annotations
 */
@Editor("AddLombok", "adds ")
@Tags("rug", "lombok", "maven", "shboland")
export class AddLombok implements EditProject {
    @Parameter({
        displayName: "Module name",
        description: "Name of the module we want to add",
        pattern: Pattern.any,
        validInput: "Name",
        minLength: 0,
        maxLength: 100,
        required: false,
    })
    public module: string;

    @Parameter({
        displayName: "Path to file",
        description: "Path from project root to target java class file",
        pattern: Pattern.any,
        validInput: "Relative path vb: persistence/src/main/java/Adres.java",
        minLength: 1,
        maxLength: 100,
        required: true,
    })
    public pathToClass: string;

    @Parameter({
        displayName: "Version",
        description: "Version of lombok",
        pattern: Pattern.any,
        validInput: "Release number",
        minLength: 0,
        maxLength: 100,
        required: false,
    })
    public version: string = "1.16.18";

    public edit(project: Project) {
        const file: File = fileFunctions.findFile(project, this.pathToClass);

        this.addDependencies(project);
        this.addImports(file);
        this.addAnnotations(file);
    }

    private addDependencies(project: Project): void {
        // Master pom
        const lombokDependency = `            <dependency>
                <groupId>org.projectlombok</groupId>
                <artifactId>lombok</artifactId>
                <version>${this.version}</version>
                <scope>provided</scope>
            </dependency>`;

        const eng: PathExpressionEngine = project.context.pathExpressionEngine;

        eng.with<Pom>(project, "/Pom()", pom => {
            pom.addOrReplaceDependencyManagementDependency("org.projectlombok", "lombok", lombokDependency);
        });

        // Module pom
        const targetFilePath = this.module + "/pom.xml";
        const modulePomFile: File = fileFunctions.findFile(project, targetFilePath);

        eng.with<Pom>(modulePomFile, "/Pom()", pom => {
            pom.addOrReplaceDependency("org.projectlombok", "lombok");
        });
    }

    private addImports(file: File): void {
        javaFunctions.addImport(file, "lombok.Getter");
        javaFunctions.addImport(file, "lombok.Setter");
        javaFunctions.addImport(file, "lombok.Builder");
        javaFunctions.addImport(file, "lombok.NoArgsConstructor");
    }

    private addAnnotations(file: File): void {
        javaFunctions.addAnnotationToClass(file, "@Getter");
        javaFunctions.addAnnotationToClass(file, "@Setter");
        javaFunctions.addAnnotationToClass(file, "@Builder");
        javaFunctions.addAnnotationToClass(file, "@NoArgsConstructor");
    }
}

export const addLombok = new AddLombok();
