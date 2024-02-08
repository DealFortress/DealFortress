using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DealFortress.Modules.Conversations.Core.DAL.Migrations
{
    /// <inheritdoc />
    public partial class AddBuyerandSellerLastReadMessageColumn : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsRead",
                schema: "conversationsContext",
                table: "Messages",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "BuyerLastReadMessageId",
                schema: "conversationsContext",
                table: "Conversations",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "SellerLastReadMessageId",
                schema: "conversationsContext",
                table: "Conversations",
                type: "int",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsRead",
                schema: "conversationsContext",
                table: "Messages");

            migrationBuilder.DropColumn(
                name: "BuyerLastReadMessageId",
                schema: "conversationsContext",
                table: "Conversations");

            migrationBuilder.DropColumn(
                name: "SellerLastReadMessageId",
                schema: "conversationsContext",
                table: "Conversations");
        }
    }
}
