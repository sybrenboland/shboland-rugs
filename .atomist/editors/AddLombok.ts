import {Project} from "@atomist/rug/model/Project";
import {JavaClassOrInterface} from "@atomist/rug/model/JavaClassOrInterface";
import {Editor, Parameter, Tags} from "@atomist/rug/operations/Decorators";
import {EditProject} from "@atomist/rug/operations/ProjectEditor";
import {Pattern} from "@atomist/rug/operations/RugOperation";
import {PathExpressionEngine} from "@atomist/rug/tree/PathExpression";

/**
 * AddLicense editor
 * - Adds maven dependency (if not present)
 * -
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
    public moduleName: string;

    @Parameter({
        displayName: "Qualified name bean",
        description: "package + bean.java",
        pattern: Pattern.any,
        validInput: "Fully qualified name of the bean",
        minLength: 1,
        maxLength: 100,
        required: false,
    })
    public beanPackage: string;

    public edit(project: Project) {
        updatePom(project);

    }
}

export function updatePom(project: Project): void {

    const eng: PathExpressionEngine = project.context.pathExpressionEngine;

    // eng.with<Pom>(project, "/Pom()", pom => {
    //     pom.addOrReplaceDependencyManagementDependency(
    //         "org.projectlombok",
    //         "lombok",
    //         "<dependency> " +
    //         "<groupId>org.projectlombok</groupId> " +
    //         "<artifactId>lombok</artifactId> " +
    //         "<version>1.16.18</version> " +
    //         "</dependency>",
    //     );
    // });

    // if (this.moduleName != null) {
    //     eng.with<Pom>(project, "module1/Pom()", pom => {
    //         pom.addOrReplaceDependency("org.projectlombok", "lombok");
    //     });
    // }
    console.error("begin");

    // eng.with<JavaClassOrInterface>(project, "/module1/src/main/java/bean/Person.java", javaClass => {
    //     console.error("errorLogging1");
    //     console.error(javaClass.name);
    //     javaClass.addAnnotation(javaClass.pkg, "@Builder");
    // });
    const targetFile = "src/main/java/Adres.java";

    const certainFile = project.findFile(targetFile);
    if (certainFile === null) {
        console.error("File not found");
    }

    ////////////////////////////////////////
    // AddFunction
    const newFunction = `
    // @Input

    public Long findNumberOfBeans() {
        return getObjectCount();
    }
`;
    // certainFile.replace("// @Input", newFunction);

    ////////////////////////////////////////
    // AddAnnotationToClass
    const newAnnotation = `@Getter
public class`;
    // certainFile.replace("public class", newAnnotation);

    /////////////////////////////////////////
    // Add import
    const newImport = ["import lombok.getter;"];

    // certainFile.replace("import", newImport);
    const newContent = certainFile.content.split("\n").slice(0, 2)
        .concat(newImport
            .concat(certainFile.content.split("\n").slice(2)))
        .reduce((a, b) => a + "\n" + b);
    certainFile.setContent(newContent);





////////////////////////////

    // project.context.pathExpressionEngine.with<JavaClassOrInterface>(project,
    //     `/module1/src/main/java/Person.java/JavaClassOrInterface()`, java => {
    //         console.error(java.isInterface);
    //         java.addAnnotation("javax.persistence", "Entity");
    //     });

    // const newContent = certainFile.content + newFunction;
    // certainFile.setContent(newContent);

    console.error("end");

}

export const addLombok = new AddLombok();
