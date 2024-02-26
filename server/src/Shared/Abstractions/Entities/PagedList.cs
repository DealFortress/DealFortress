using System.Text.Json.Serialization;
using AutoMapper;
using Microsoft.EntityFrameworkCore;

namespace DealFortress.Shared.Abstractions.Entities;

public class PaginationMetaData {
    [JsonIgnore]
    public int PageIndex  { get; set;}
    [JsonIgnore]
    public int PageSize   { get; set;}
    public int TotalCount { get; set;}
    public int TotalPages { get; set;}    
    public bool HasPreviousPage => PageIndex > 1;
    public bool HasNextPage => PageIndex < TotalPages;
};


public class PagedList<TResult> : List<TResult>
{
    public List<TResult> Items { get;}
    public PaginationMetaData MetaData {get;}

    public Object JsonObject {get;}
    public PagedList(List<TResult> items,int totalCount, int pageIndex, int pageSize) {
        MetaData = new PaginationMetaData();
        Items = items;
        MetaData.PageIndex = pageIndex;
        MetaData.PageSize = pageSize;
        MetaData.TotalCount = totalCount;
        MetaData.TotalPages = (int) Math.Ceiling(totalCount / (double)pageSize);
        
        JsonObject = new {items = Items, metadata = MetaData };
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


 