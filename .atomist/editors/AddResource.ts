import {File} from "@atomist/rug/model/File";
import {Project} from "@atomist/rug/model/Project";
import {Editor, Parameter, Tags} from "@atomist/rug/operations/Decorators";
import {EditProject} from "@atomist/rug/operations/ProjectEditor";
import {Pattern} from "@atomist/rug/operations/RugOperation";
import {PathExpressionEngine} from "@atomist/rug/tree/PathExpression";

/**
 * AddResource editor
 * - Adds GET resource for given bean.
 */
@Editor("AddResource", "adds GET resource for given bean")
@Tags("rug", "shboland", "resource", "spring", "rest")
export class AddResource implements EditProject {
    @Parameter({
        displayName: "Bean Name",
        description: "name for the bean class",
        pattern: Pattern.java_class,
        validInput: "a valid Java class name",
        minLength: 1,
        maxLength: 50
    })
    bean_name: string;

    @Parameter({
        displayName: "Module Name",
        description: "name for the module of the project",
        pattern: Pattern.java_package,
        validInput: "a valid package name",
        minLength: 1,
        maxLength: 50
    })
    module: string;

    @Parameter({
        displayName: "Package name",
        description: "name for the base package of the organisation",
        pattern: Pattern.java_package,
        validInput: "a valid package name",
        minLength: 1,
        maxLength: 50
    })
    org_package: string;

    public edit(project: Project) {
        this.findOrCreateResourceFile();
        this.addResourceCode();
        this.checkOrAddDependencies();

        const rawJavaFileContent = `package org.shboland.api.resource;

import org.springframework.stereotype.Component;

import javax.annotation.Resource;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

@Path("/v1/${this.bean_name.toLowerCase()}s")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@Component("${this.bean_name.toLowerCase()}Resource")
public class BeanResource {

    @GET
    @Path("/{${this.bean_name.toLowerCase()}Id}")
    public Response get(@PathParam("${this.bean_name.toLowerCase()}Id") Long ${this.bean_name.toLowerCase()}Id) {

        return Response.ok("success!").build();
    }
}`;

        project.addFile(`${this.module + "/"}api/src/main/java/${this.org_package}/api/resource/${this.bean_name}Resource.java`, rawJavaFileContent);
    }

    private findOrCreateResourceFile() {
        return undefined;
    }

    private addResourceCode() {
        return undefined;
    }

    private checkOrAddDependencies() {
        return undefined;
    }
}

export const addResource = new AddResource();
