import {File} from "@atomist/rug/model/File";
import {Pom} from "@atomist/rug/model/Pom";
import {Project} from "@atomist/rug/model/Project";
import {Editor, Parameter, Tags} from "@atomist/rug/operations/Decorators";
import {EditProject} from "@atomist/rug/operations/ProjectEditor";
import {Pattern} from "@atomist/rug/operations/RugOperation";
import {PathExpressionEngine} from "@atomist/rug/tree/PathExpression";
import {javaFunctions} from "./JavaClassFunctions";

/**
 * AddGET editor
 * - Adds maven dependencies
 * - Adds method to resource class and interface
 * - Adds method to service
 * - Adds method to converter
 *
 * Requires:
 * - Bean class
 * - Domain class
 * - Resource class and interface
 * - Service class
 * - Repository
 */
// @Editor("AddGET", "adds REST get method")
@Tags("rug", "api", "GET", "shboland")
export class AddGET implements EditProject {
    @Parameter({
        displayName: "Class name",
        description: "Name of the class we want to add",
        pattern: Pattern.java_class,
        validInput: "Java class name",
        minLength: 1,
        maxLength: 100,
        required: true,
    })
    public className: string;

    @Parameter({
        displayName: "Base package name",
        description: "Name of the base package in witch we want to add",
        pattern: Pattern.java_package,
        validInput: "Java package name",
        minLength: 0,
        maxLength: 100,
        required: true,
    })
    public basePackage: string;

    @Parameter({
        displayName: "Module name",
        description: "Name of the module we want to add",
        pattern: Pattern.any,
        validInput: "Name",
        minLength: 0,
        maxLength: 100,
        required: false,
    })
    public module: string = "api";

    public edit(project: Project) {

        const basePath = this.module + "/src/main/java/" + this.basePackage.replace(/\./gi, "/");

        this.addDependencies(project);
        this.addResourceInterfaceMethod(project, basePath);
        this.addResourceClassMethod(project, basePath);
        addServiceMethodFetchBean(project, this.className, this.basePackage, basePath);
    }

    private addDependencies(project: Project): void {
        const eng: PathExpressionEngine = project.context.pathExpressionEngine;

        eng.with<Pom>(project, "/Pom()", pom => {
            pom.addOrReplaceDependency("org.springframework.boot", "spring-boot-starter-web");
        });
    }

    private addResourceInterfaceMethod(project: Project, basePath: string): void {

        const rawJavaMethod = `
    @RequestMapping(path = "/{${this.className.toLowerCase()}Id}", method = RequestMethod.GET)
    ResponseEntity<Json${this.className}> get${this.className}(@PathVariable long ${this.className.toLowerCase()}Id);`;

        const path = basePath + "/resource/I" + this.className + "Controller.java";
        const file: File = project.findFile(path);
        javaFunctions.addFunction(file, "get" + this.className, rawJavaMethod);

        javaFunctions.addImport(file, "org.springframework.web.bind.annotation.PathVariable");
        javaFunctions.addImport(file, "org.springframework.web.bind.annotation.RequestMethod");
        javaFunctions.addImport(file, "org.springframework.web.bind.annotation.RequestMapping");
        javaFunctions.addImport(file, "org.springframework.http.ResponseEntity");
        javaFunctions.addImport(file, this.basePackage + ".domain.Json" + this.className);
    }

    private addResourceClassMethod(project: Project, basePath: string): void {

        const rawJavaMethod = `
    @Override
    public ResponseEntity<Json${this.className}> get${this.className}` +
            `(@PathVariable long ${this.className.toLowerCase()}Id) {
        Optional<Json${this.className}> ${this.className.toLowerCase()}Optional = ` +
            `${this.className.toLowerCase()}Service.fetch${this.className}(${this.className.toLowerCase()}Id);

        return ${this.className.toLowerCase()}Optional.isPresent() ?
                ResponseEntity.ok(${this.className.toLowerCase()}Optional.get()) :
                ResponseEntity.notFound().build();
    }`;

        const path = basePath + "/resource/" + this.className + "Controller.java";
        const file: File = project.findFile(path);
        javaFunctions.addFunction(file, "get" + this.className, rawJavaMethod);

        javaFunctions.addImport(file, "java.util.Optional");
        javaFunctions.addImport(file, "org.springframework.web.bind.annotation.PathVariable");
        javaFunctions.addImport(file, "org.springframework.http.ResponseEntity");
        javaFunctions.addImport(file, this.basePackage + ".domain.Json" + this.className);
    }
}

export function addServiceMethodFetchBean(project: Project, className: string, basePackage: string, basePath: string) {

    const rawJavaMethod = `
    public Optional<Json${className}> fetch${className}(long ${className.toLowerCase()}Id) {
        ${className} ${className.toLowerCase()} = ` +
        `${className.toLowerCase()}Repository.findOne(${className.toLowerCase()}Id);

        return ${className.toLowerCase()} == null ? Optional.empty() : ` +
        `Optional.of(${className.toLowerCase()}Converter.toJson(${className.toLowerCase()}));
    }`;

    const path = basePath + "/service/" + className + "Service.java";
    const file: File = project.findFile(path);
    javaFunctions.addFunction(file, "fetch" + className, rawJavaMethod);

    javaFunctions.addImport(file, "java.util.Optional");
    javaFunctions.addImport(file, basePackage + ".domain.Json" + className);
    javaFunctions.addImport(file, basePackage + ".db.hibernate.bean." + className);
}

export const addGet = new AddGET();
