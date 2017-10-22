import { Project } from "@atomist/rug/model/Project";
import { Editor, Parameter, Tags } from "@atomist/rug/operations/Decorators";
import { EditProject } from "@atomist/rug/operations/ProjectEditor";
import { Pattern } from "@atomist/rug/operations/RugOperation";

/**
 * AddBeanClass editor
 * - Adds hibernate bean class
 */
@Editor("AddBeanClass", "adds hibernate bean class")
@Tags("rug", "hibernate", "bean", "shboland")
export class AddBeanClass implements EditProject {
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
    public moduleName: string;

    @Parameter({
        displayName: "Release",
        description: "Release for with database changes are meant",
        pattern: Pattern.any,
        validInput: "Release number",
        minLength: 0,
        maxLength: 100,
        required: false,
    })
    public release: string = "1.0.0";

    public edit(project: Project) {

        const beanPackage = "db.hibernate.bean";
        const basePath = this.moduleName + "/src/main";
        const pathClass = basePath + "/java/" + this.basePackage.replace("\.", "/")
            + "/db/hibernate/bean/" + this.className + ".java";
        const pathChangeset = basePath + "/resources/liquibase/" + this.release + "/create-"
            + this.className.toLowerCase() + ".xml";

        const rawJavaFileContent = `package ${this.basePackage + "." + beanPackage};

import javax.persistence.*;

@Entity
@Table(name = "${this.className.toUpperCase()}")
public class ${this.className} {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    private Long id;
}`;
        const rawChangesetContent = "<databaseChangeLog xmlns=\"http://www.liquibase.org/xml/ns/dbchangelog\"\n" +
            "  xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\"\n" +
            "  xsi:schemaLocation=\"http://www.liquibase.org/xml/ns/dbchangelog\n" +
            "                        http://www.liquibase.org/xml/ns/dbchangelog/dbchangelog-3.4.xsd\">\n" +
            " \n" +
            "  <changeSet id=\"create_${this.className.toLowerCase()}\" author=\"shboland\">\n" +
            "    <createTable tableName=\"${this.className.toUpperCase()}\">\n" +
            "      <column name=\"id\" type=\"int\">\n" +
            "        <constraints primaryKey=\"true\" nullable=\"false\" />\n" +
            "      </column>\n" +
            "    </createTable>\n" +
            "  </changeSet>\n" +
            "</databaseChangeLog>";

        if (!project.fileExists(pathClass)) {
            project.addFile(pathClass, rawJavaFileContent);
        }

        if (!project.fileExists(pathChangeset)) {
            project.addFile(pathChangeset, rawChangesetContent);
        }
    }
}

export const addBeanClass = new AddBeanClass();
