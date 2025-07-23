import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTBlSalesReports1753230182084 implements MigrationInterface {
    name = 'AddTBlSalesReports1753230182084'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "sales_reports" ("id" SERIAL NOT NULL, "period" TIMESTAMP WITH TIME ZONE NOT NULL, "totalSales" numeric(10,2) NOT NULL, "productsSold" integer NOT NULL, "filePath" character varying NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_dfa39719bf5ca1dea7011f8e613" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "sales_reports"`);
    }

}
