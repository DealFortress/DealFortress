using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DealFortress.Modules.Notices.Core.DAL.Migrations
{
    /// <inheritdoc />
    public partial class PluralizePaymentsAndDelivery : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Payment",
                schema: "noticesContext",
                table: "Notices",
                newName: "Payments");

            migrationBuilder.RenameColumn(
                name: "DeliveryMethod",
                schema: "noticesContext",
                table: "Notices",
                newName: "DeliveryMethods");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Payments",
                schema: "noticesContext",
                table: "Notices",
                newName: "Payment");

            migrationBuilder.RenameColumn(
                name: "DeliveryMethods",
                schema: "noticesContext",
                table: "Notices",
                newName: "DeliveryMethod");
        }
    }
}
