import {Project} from "@atomist/rug/model/Project";
import {Then} from "@atomist/rug/test/project/Core";
import {BasePackage, getModule} from "./Constants";
import {fileFunctions} from "../../../editors/functions/FileFunctions";

Then("the (.*) module contains (.*) properties in (.*)",
    (p: Project, w, module: string, configSubject: string, configFile: string) => {
        return p.fileContains(getModule(module) + "/src/main/resources/" + configFile, configSubject);
});

Then("the method (.*) is added to (.*) in the (.*) module",
    (p: Project, w, methodName: string, className: string, moduleName: string) => {
        return p.fileContains(getModule(moduleName) + "/src/main/java/" + fileFunctions.toPath(BasePackage)
            + "/" + className + ".java", methodName);
});
