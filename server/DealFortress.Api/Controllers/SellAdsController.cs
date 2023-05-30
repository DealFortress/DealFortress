using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DealFortress.Api.Models;

namespace DealFortress.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SellAdsController : ControllerBase
    {
        private readonly DealFortressContext _context;

        public SellAdsController(DealFortressContext context)
        {
            _context = context;
        }

        // GET: api/SellAds
        [HttpGet]
        public async Task<ActionResult<IEnumerable<SellAd>>> GetSellAd()
        {
          if (_context.SellAd == null)
          {
              return NotFound();
          }
            return await _context.SellAd.ToListAsync();
        }

        // GET: api/SellAds/5
        [HttpGet("{id}")]
        public async Task<ActionResult<SellAd>> GetSellAd(int id)
        {
          if (_context.SellAd == null)
          {
              return NotFound();
          }
            var sellAd = await _context.SellAd.FindAsync(id);

            if (sellAd == null)
            {
                return NotFound();
            }

            return sellAd;
        }

        // PUT: api/SellAds/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutSellAd(int id, SellAd sellAd)
        {
            if (id != sellAd.Id)
            {
                return BadRequest();
            }

            _context.Entry(sellAd).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SellAdExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/SellAds
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<SellAd>> PostSellAd(SellAd sellAd)
        {
          if (_context.SellAd == null)
          {
              return Problem("Entity set 'DealFortressContext.SellAd'  is null.");
          }
            _context.SellAd.Add(sellAd);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetSellAd", new { id = sellAd.Id }, sellAd);
        }

        // DELETE: api/SellAds/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSellAd(int id)
        {
            if (_context.SellAd == null)
            {
                return NotFound();
            }
            var sellAd = await _context.SellAd.FindAsync(id);
            if (sellAd == null)
            {
                return NotFound();
            }

            _context.SellAd.Remove(sellAd);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool SellAdExists(int id)
        {
            return (_context.SellAd?.Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}
