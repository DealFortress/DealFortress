using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DealFortress.Modules.Conversations.Core.DAL.Migrations
{
    /// <inheritdoc />
    public partial class ReplaceUserOneToBuyerAndUserTwoToSeller : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "UserTwoId",
                schema: "conversationsContext",
                table: "Conversations",
                newName: "SellerId");

            migrationBuilder.RenameColumn(
                name: "UserOneId",
                schema: "conversationsContext",
                table: "Conversations",
                newName: "BuyerId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "SellerId",
                schema: "conversationsContext",
                table: "Conversations",
                newName: "UserTwoId");

            migrationBuilder.RenameColumn(
                name: "BuyerId",
                schema: "conversationsContext",
                table: "Conversations",
                newName: "UserOneId");
        }
    }
}
