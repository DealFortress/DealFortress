using AutoMapper;
using Microsoft.EntityFrameworkCore;

namespace DealFortress.Shared.Abstractions.Entities;
public class PagedList<TResult> : List<TResult>
{
    public List<TResult> Items { get;}
    public int PageIndex  { get;}
    public int PageSize   { get;}
    public int TotalCount { get;}
    public int TotalPages { get;}    
    public bool HasPreviousPage => PageIndex > 1;
    public bool HasNextPage => PageIndex < TotalPages;
    public PagedList(List<TResult> items,int totalCount, int pageIndex, int pageSize) {
        Items = items;
        PageIndex = pageIndex;
        PageSize = pageSize;
        TotalCount = totalCount;
        TotalPages = (int) Math.Ceiling(TotalCount / (double)PageSize);
    }
    public static async Task<PagedList<TResult>> CreateAsync(
        IQueryable<TResult> source, int pageIndex, int pageSize)
    {
        var totalCount = await source.CountAsync();
        var items = await source
            .Skip(pageIndex * pageSize)
            .Take(pageSize)
            .ToListAsync();
        return new PagedList<TResult>(items, totalCount,  pageIndex, pageSize);
    }
    
    public static async Task<PagedList<TResult>> CreateAsync<TSource>(
    IQueryable<TSource> source, int pageIndex, int pageSize, IMapper mapper)
    {
        var totalCount = source.Count();
        var items = await source
            .Skip(pageIndex  * pageSize)
            .Take(pageSize)
            .Select(ufc => mapper.Map<TResult>(ufc))
            .ToListAsync();

        return new PagedList<TResult>(items, totalCount,  pageIndex, pageSize);
    }
} 


 