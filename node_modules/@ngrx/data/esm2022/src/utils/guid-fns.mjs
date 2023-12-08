/**
  Client-side id-generators

  These GUID utility functions are not used by @ngrx/data itself at this time.
  They are included as candidates for generating persistable correlation ids if that becomes desirable.
  They are also safe for generating unique entity ids on the client.

  Note they produce 32-character hexadecimal UUID strings,
  not the 128-bit representation found in server-side languages and databases.

  These utilities are experimental and may be withdrawn or replaced in future.
*/
/**
 * Creates a Universally Unique Identifier (AKA GUID)
 */
function getUuid() {
    // The original implementation is based on this SO answer:
    // http://stackoverflow.com/a/2117523/200253
    return 'xxxxxxxxxx4xxyxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        // eslint-disable-next-line no-bitwise
        const r = (Math.random() * 16) | 0, 
        // eslint-disable-next-line no-bitwise
        v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}
/** Alias for getUuid(). Compare with getGuidComb(). */
export function getGuid() {
    return getUuid();
}
/**
 * Creates a sortable, pseudo-GUID (globally unique identifier)
 * whose trailing 6 bytes (12 hex digits) are time-based
 * Start either with the given getTime() value, seedTime,
 * or get the current time in ms.
 *
 * @param seed {number} - optional seed for reproducible time-part
 */
export function getGuidComb(seed) {
    // Each new Guid is greater than next if more than 1ms passes
    // See http://thatextramile.be/blog/2009/05/using-the-guidcomb-identifier-strategy
    // Based on breeze.core.getUuid which is based on this StackOverflow answer
    // http://stackoverflow.com/a/2117523/200253
    //
    // Convert time value to hex: n.toString(16)
    // Make sure it is 6 bytes long: ('00'+ ...).slice(-12) ... from the rear
    // Replace LAST 6 bytes (12 hex digits) of regular Guid (that's where they sort in a Db)
    //
    // Play with this in jsFiddle: http://jsfiddle.net/wardbell/qS8aN/
    const timePart = ('00' + (seed || new Date().getTime()).toString(16)).slice(-12);
    return ('xxxxxxxxxx4xxyxxx'.replace(/[xy]/g, function (c) {
        /* eslint-disable no-bitwise */
        const r = (Math.random() * 16) | 0, v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    }) + timePart);
}
// Sort comparison value that's good enough
export function guidComparer(l, r) {
    const lLow = l.slice(-12);
    const rLow = r.slice(-12);
    return lLow !== rLow
        ? lLow < rLow
            ? -1
            : +(lLow !== rLow)
        : l < r
            ? -1
            : +(l !== r);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3VpZC1mbnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9tb2R1bGVzL2RhdGEvc3JjL3V0aWxzL2d1aWQtZm5zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7OztFQVdFO0FBRUY7O0dBRUc7QUFDSCxTQUFTLE9BQU87SUFDZCwwREFBMEQ7SUFDMUQsNENBQTRDO0lBQzVDLE9BQU8sOEJBQThCLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxVQUFVLENBQUM7UUFDaEUsc0NBQXNDO1FBQ3RDLE1BQU0sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUM7UUFDaEMsc0NBQXNDO1FBQ3RDLENBQUMsR0FBRyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQztRQUN0QyxPQUFPLENBQUMsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDeEIsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDO0FBRUQsdURBQXVEO0FBQ3ZELE1BQU0sVUFBVSxPQUFPO0lBQ3JCLE9BQU8sT0FBTyxFQUFFLENBQUM7QUFDbkIsQ0FBQztBQUVEOzs7Ozs7O0dBT0c7QUFDSCxNQUFNLFVBQVUsV0FBVyxDQUFDLElBQWE7SUFDdkMsNkRBQTZEO0lBQzdELGtGQUFrRjtJQUNsRiwyRUFBMkU7SUFDM0UsNENBQTRDO0lBQzVDLEVBQUU7SUFDRiw0Q0FBNEM7SUFDNUMseUVBQXlFO0lBQ3pFLHdGQUF3RjtJQUN4RixFQUFFO0lBQ0Ysa0VBQWtFO0lBQ2xFLE1BQU0sUUFBUSxHQUFHLENBQUMsSUFBSSxHQUFHLENBQUMsSUFBSSxJQUFJLElBQUksSUFBSSxFQUFFLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQ3pFLENBQUMsRUFBRSxDQUNKLENBQUM7SUFDRixPQUFPLENBQ0wsbUJBQW1CLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxVQUFVLENBQUM7UUFDOUMsK0JBQStCO1FBQy9CLE1BQU0sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFDaEMsQ0FBQyxHQUFHLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDO1FBQ3RDLE9BQU8sQ0FBQyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUN4QixDQUFDLENBQUMsR0FBRyxRQUFRLENBQ2QsQ0FBQztBQUNKLENBQUM7QUFFRCwyQ0FBMkM7QUFDM0MsTUFBTSxVQUFVLFlBQVksQ0FBQyxDQUFTLEVBQUUsQ0FBUztJQUMvQyxNQUFNLElBQUksR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDMUIsTUFBTSxJQUFJLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQzFCLE9BQU8sSUFBSSxLQUFLLElBQUk7UUFDbEIsQ0FBQyxDQUFDLElBQUksR0FBRyxJQUFJO1lBQ1gsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNKLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxLQUFLLElBQUksQ0FBQztRQUNwQixDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUM7WUFDUCxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ0osQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7QUFDakIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICBDbGllbnQtc2lkZSBpZC1nZW5lcmF0b3JzXG5cbiAgVGhlc2UgR1VJRCB1dGlsaXR5IGZ1bmN0aW9ucyBhcmUgbm90IHVzZWQgYnkgQG5ncngvZGF0YSBpdHNlbGYgYXQgdGhpcyB0aW1lLlxuICBUaGV5IGFyZSBpbmNsdWRlZCBhcyBjYW5kaWRhdGVzIGZvciBnZW5lcmF0aW5nIHBlcnNpc3RhYmxlIGNvcnJlbGF0aW9uIGlkcyBpZiB0aGF0IGJlY29tZXMgZGVzaXJhYmxlLlxuICBUaGV5IGFyZSBhbHNvIHNhZmUgZm9yIGdlbmVyYXRpbmcgdW5pcXVlIGVudGl0eSBpZHMgb24gdGhlIGNsaWVudC5cblxuICBOb3RlIHRoZXkgcHJvZHVjZSAzMi1jaGFyYWN0ZXIgaGV4YWRlY2ltYWwgVVVJRCBzdHJpbmdzLFxuICBub3QgdGhlIDEyOC1iaXQgcmVwcmVzZW50YXRpb24gZm91bmQgaW4gc2VydmVyLXNpZGUgbGFuZ3VhZ2VzIGFuZCBkYXRhYmFzZXMuXG5cbiAgVGhlc2UgdXRpbGl0aWVzIGFyZSBleHBlcmltZW50YWwgYW5kIG1heSBiZSB3aXRoZHJhd24gb3IgcmVwbGFjZWQgaW4gZnV0dXJlLlxuKi9cblxuLyoqXG4gKiBDcmVhdGVzIGEgVW5pdmVyc2FsbHkgVW5pcXVlIElkZW50aWZpZXIgKEFLQSBHVUlEKVxuICovXG5mdW5jdGlvbiBnZXRVdWlkKCkge1xuICAvLyBUaGUgb3JpZ2luYWwgaW1wbGVtZW50YXRpb24gaXMgYmFzZWQgb24gdGhpcyBTTyBhbnN3ZXI6XG4gIC8vIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9hLzIxMTc1MjMvMjAwMjUzXG4gIHJldHVybiAneHh4eHh4eHh4eDR4eHl4eHh4eHh4eHh4eHh4eCcucmVwbGFjZSgvW3h5XS9nLCBmdW5jdGlvbiAoYykge1xuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1iaXR3aXNlXG4gICAgY29uc3QgciA9IChNYXRoLnJhbmRvbSgpICogMTYpIHwgMCxcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1iaXR3aXNlXG4gICAgICB2ID0gYyA9PT0gJ3gnID8gciA6IChyICYgMHgzKSB8IDB4ODtcbiAgICByZXR1cm4gdi50b1N0cmluZygxNik7XG4gIH0pO1xufVxuXG4vKiogQWxpYXMgZm9yIGdldFV1aWQoKS4gQ29tcGFyZSB3aXRoIGdldEd1aWRDb21iKCkuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0R3VpZCgpIHtcbiAgcmV0dXJuIGdldFV1aWQoKTtcbn1cblxuLyoqXG4gKiBDcmVhdGVzIGEgc29ydGFibGUsIHBzZXVkby1HVUlEIChnbG9iYWxseSB1bmlxdWUgaWRlbnRpZmllcilcbiAqIHdob3NlIHRyYWlsaW5nIDYgYnl0ZXMgKDEyIGhleCBkaWdpdHMpIGFyZSB0aW1lLWJhc2VkXG4gKiBTdGFydCBlaXRoZXIgd2l0aCB0aGUgZ2l2ZW4gZ2V0VGltZSgpIHZhbHVlLCBzZWVkVGltZSxcbiAqIG9yIGdldCB0aGUgY3VycmVudCB0aW1lIGluIG1zLlxuICpcbiAqIEBwYXJhbSBzZWVkIHtudW1iZXJ9IC0gb3B0aW9uYWwgc2VlZCBmb3IgcmVwcm9kdWNpYmxlIHRpbWUtcGFydFxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0R3VpZENvbWIoc2VlZD86IG51bWJlcikge1xuICAvLyBFYWNoIG5ldyBHdWlkIGlzIGdyZWF0ZXIgdGhhbiBuZXh0IGlmIG1vcmUgdGhhbiAxbXMgcGFzc2VzXG4gIC8vIFNlZSBodHRwOi8vdGhhdGV4dHJhbWlsZS5iZS9ibG9nLzIwMDkvMDUvdXNpbmctdGhlLWd1aWRjb21iLWlkZW50aWZpZXItc3RyYXRlZ3lcbiAgLy8gQmFzZWQgb24gYnJlZXplLmNvcmUuZ2V0VXVpZCB3aGljaCBpcyBiYXNlZCBvbiB0aGlzIFN0YWNrT3ZlcmZsb3cgYW5zd2VyXG4gIC8vIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9hLzIxMTc1MjMvMjAwMjUzXG4gIC8vXG4gIC8vIENvbnZlcnQgdGltZSB2YWx1ZSB0byBoZXg6IG4udG9TdHJpbmcoMTYpXG4gIC8vIE1ha2Ugc3VyZSBpdCBpcyA2IGJ5dGVzIGxvbmc6ICgnMDAnKyAuLi4pLnNsaWNlKC0xMikgLi4uIGZyb20gdGhlIHJlYXJcbiAgLy8gUmVwbGFjZSBMQVNUIDYgYnl0ZXMgKDEyIGhleCBkaWdpdHMpIG9mIHJlZ3VsYXIgR3VpZCAodGhhdCdzIHdoZXJlIHRoZXkgc29ydCBpbiBhIERiKVxuICAvL1xuICAvLyBQbGF5IHdpdGggdGhpcyBpbiBqc0ZpZGRsZTogaHR0cDovL2pzZmlkZGxlLm5ldC93YXJkYmVsbC9xUzhhTi9cbiAgY29uc3QgdGltZVBhcnQgPSAoJzAwJyArIChzZWVkIHx8IG5ldyBEYXRlKCkuZ2V0VGltZSgpKS50b1N0cmluZygxNikpLnNsaWNlKFxuICAgIC0xMlxuICApO1xuICByZXR1cm4gKFxuICAgICd4eHh4eHh4eHh4NHh4eXh4eCcucmVwbGFjZSgvW3h5XS9nLCBmdW5jdGlvbiAoYykge1xuICAgICAgLyogZXNsaW50LWRpc2FibGUgbm8tYml0d2lzZSAqL1xuICAgICAgY29uc3QgciA9IChNYXRoLnJhbmRvbSgpICogMTYpIHwgMCxcbiAgICAgICAgdiA9IGMgPT09ICd4JyA/IHIgOiAociAmIDB4MykgfCAweDg7XG4gICAgICByZXR1cm4gdi50b1N0cmluZygxNik7XG4gICAgfSkgKyB0aW1lUGFydFxuICApO1xufVxuXG4vLyBTb3J0IGNvbXBhcmlzb24gdmFsdWUgdGhhdCdzIGdvb2QgZW5vdWdoXG5leHBvcnQgZnVuY3Rpb24gZ3VpZENvbXBhcmVyKGw6IHN0cmluZywgcjogc3RyaW5nKSB7XG4gIGNvbnN0IGxMb3cgPSBsLnNsaWNlKC0xMik7XG4gIGNvbnN0IHJMb3cgPSByLnNsaWNlKC0xMik7XG4gIHJldHVybiBsTG93ICE9PSByTG93XG4gICAgPyBsTG93IDwgckxvd1xuICAgICAgPyAtMVxuICAgICAgOiArKGxMb3cgIT09IHJMb3cpXG4gICAgOiBsIDwgclxuICAgID8gLTFcbiAgICA6ICsobCAhPT0gcik7XG59XG4iXX0=