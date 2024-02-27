using System.Text.Json.Serialization;
using AutoMapper;
using Microsoft.EntityFrameworkCore;

namespace DealFortress.Shared.Abstractions.Entities;

public class PaginationMetaData {
    public int PageIndex  { get; set;}
    public int PageSize   { get; set;}
    public int TotalCount { get; set;}
    public int TotalPages { get; set;}    
    public bool HasPreviousPage => PageIndex > 1;
    public bool HasNextPage => PageIndex < TotalPages;
};


public class PagedList<TResult> 
{
    public List<TResult> Entities { get;}
    public PaginationMetaData MetaData {get;}
    public PagedList(List<TResult> entities,int totalCount, int pageIndex, int pageSize) {
        MetaData = new PaginationMetaData();
        Entities = entities;
        MetaData.PageIndex = pageIndex;
        MetaData.PageSize = pageSize;
        MetaData.TotalCount = totalCount;
        MetaData.TotalPages = (int) Math.Ceiling(totalCount / (double)pageSize);

    }
    public static async Task<PagedList<TResult>> CreateAsync(
        IQueryable<TResult> source, int pageIndex, int pageSize)
    {
        var totalCount = await source.CountAsync();
        var entities = await source
            .Skip(pageIndex * pageSize)
            .Take(pageSize)
            .ToListAsync();
        return new PagedList<TResult>(entities, totalCount,  pageIndex, pageSize);
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


 