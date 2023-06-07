using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DealFortress.Api.Migrations
{
    /// <inheritdoc />
    public partial class ChangeCategoryNameToString : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Notices_Category_CategoryId",
                table: "Notices");

            migrationBuilder.DropIndex(
                name: "IX_Notices_CategoryId",
                table: "Notices");

            migrationBuilder.DropColumn(
                name: "CategoryId",
                table: "Notices");

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "Category",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "CategoryId",
                table: "Notices",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "Name",
                table: "Category",
                type: "int",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.CreateIndex(
                name: "IX_Notices_CategoryId",
                table: "Notices",
                column: "CategoryId");

            migrationBuilder.AddForeignKey(
                name: "FK_Notices_Category_CategoryId",
                table: "Notices",
                column: "CategoryId",
                principalTable: "Category",
                principalColumn: "Id");
        }
    }
}
