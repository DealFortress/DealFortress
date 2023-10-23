using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DealFortress.Modules.Notices.Core.DAL.Migrations
{
    /// <inheritdoc />
    public partial class ImplementUserIdInNoticeTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "UserId",
                schema: "noticesContext",
                table: "Notices",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "UserId",
                schema: "noticesContext",
                table: "Notices");
        }
    }
}
