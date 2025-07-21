import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTBlClients1753118223362 implements MigrationInterface {
    name = 'AddTBlClients1753118223362'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "clients" ("id" SERIAL NOT NULL, "full_name" character varying NOT NULL, "contact" character varying NOT NULL, "address" text NOT NULL, "isActive" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" integer, CONSTRAINT "REL_07a7a09b04e7b035c9d90cf498" UNIQUE ("user_id"), CONSTRAINT "PK_f1ab7cf3a5714dbc6bb4e1c28a4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "clients" ADD CONSTRAINT "FK_07a7a09b04e7b035c9d90cf4984" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "clients" DROP CONSTRAINT "FK_07a7a09b04e7b035c9d90cf4984"`);
        await queryRunner.query(`DROP TABLE "clients"`);
    }

}
