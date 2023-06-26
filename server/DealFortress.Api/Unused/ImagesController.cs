using Microsoft.AspNetCore.Mvc;


namespace DealFortress.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ImagesController : ControllerBase
    {
        // private readonly DealFortressContext _context;

        // public ImagesController(DealFortressContext context)
        // {
        //     _context = context;
        // }

        // // GET: api/Images
        // [HttpGet]
        // public async Task<ActionResult<IEnumerable<Image>>> GetImage()
        // {
        //   if (_context.Images == null)
        //   {
        //       return NotFound();
        //   }
        //     return await _context.Images.ToListAsync();
        // }

        // // GET: api/Images/5
        // [HttpGet("{id}")]
        // public async Task<ActionResult<Image>> GetImage(int id)
        // {
        //   if (_context.Images == null)
        //   {
        //       return NotFound();
        //   }
        //     var image = await _context.Images.FindAsync(id);

        //     if (image == null)
        //     {
        //         return NotFound();
        //     }

        //     return image;
        // }

        // // PUT: api/Images/5
        // // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        // [HttpPut("{id}")]
        // public async Task<IActionResult> PutImage(int id, Image image)
        // {
        //     if (id != image.Id)
        //     {
        //         return BadRequest();
        //     }

        //     _context.Entry(image).State = EntityState.Modified;

        //     try
        //     {
        //         await _context.SaveChangesAsync();
        //     }
        //     catch (DbUpdateConcurrencyException)
        //     {
        //         if (!ImageExists(id))
        //         {
        //             return NotFound();
        //         }
        //         else
        //         {
        //             throw;
        //         }
        //     }

        //     return NoContent();
        // }

        // // POST: api/Images
        // // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        // [HttpPost]
        // public async Task<ActionResult<Image>> PostImage(Image image)
        // {
        //   if (_context.Images == null)
        //   {
        //       return Problem("Entity set 'DealFortressContext.Image'  is null.");
        //   }
        //     _context.Images.Add(image);
        //     await _context.SaveChangesAsync();

        //     return CreatedAtAction("GetImage", new { id = image.Id }, image);
        // }

        // // DELETE: api/Images/5
        // [HttpDelete("{id}")]
        // public async Task<IActionResult> DeleteImage(int id)
        // {
        //     if (_context.Images == null)
        //     {
        //         return NotFound();
        //     }
        //     var image = await _context.Images.FindAsync(id);
        //     if (image == null)
        //     {
        //         return NotFound();
        //     }

        //     _context.Images.Remove(image);
        //     await _context.SaveChangesAsync();

        //     return NoContent();
        // }

        // private bool ImageExists(int id)
        // {
        //     return (_context.Images?.Any(e => e.Id == id)).GetValueOrDefault();
        // }
    }
}
