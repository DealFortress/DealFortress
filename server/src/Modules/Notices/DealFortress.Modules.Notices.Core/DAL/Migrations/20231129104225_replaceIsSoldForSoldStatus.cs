using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DealFortress.Modules.Notices.Core.DAL.Migrations
{
    /// <inheritdoc />
    public partial class replaceIsSoldForSoldStatus : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsSold",
                schema: "noticesContext",
                table: "Products");

            migrationBuilder.AddColumn<int>(
                name: "SoldStatus",
                schema: "noticesContext",
                table: "Products",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "SoldStatus",
                schema: "noticesContext",
                table: "Products");

            migrationBuilder.AddColumn<bool>(
                name: "IsSold",
                schema: "noticesContext",
                table: "Products",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }
    }
}
