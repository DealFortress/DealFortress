using AutoMapper;
using Microsoft.EntityFrameworkCore;

namespace DealFortress.Shared.Abstractions.Entities;
public class PaginatedList<TResult> : List<TResult>
{
    public int PageIndex  { get;}
    public int PageSize   { get;}
    public int TotalCount { get;}
    public int TotalPages { get;}    
    public IQueryable<TResult> Entities {get;}
    public bool HasPreviousPage => PageIndex > 1;
    public bool HasNextPage => PageIndex < TotalPages;

    public PaginatedList(IQueryable<TResult> source,int totalCount, int pageIndex, int pageSize) {
        PageIndex = pageIndex;
        PageSize = pageSize;
        TotalCount = totalCount;
        Entities = source;
        TotalPages = (int) Math.Ceiling(TotalCount / (double)PageSize);

        this.AddRange(source.Skip(PageIndex * PageSize).Take(PageSize));
    }

    public static PaginatedList<TResult> Create<TSource>(
        IQueryable<TSource> source, int pageIndex, int pageSize, IMapper mapper)
    {
        var totalCount = source.Count();
        var items = source
            .Skip(pageIndex  * pageSize)
            .Take(pageSize)
            .Select(ufc => mapper.Map<TResult>(ufc));

        return new PaginatedList<TResult>(items, totalCount,  pageIndex, pageSize);
    }

    public static PaginatedList<TResult> Create(
        IQueryable<TResult> source, int pageIndex, int pageSize)
    {
        var totalCount = source.Count();
        var items = source
            .Skip(pageIndex * pageSize)
            .Take(pageSize);
        return new PaginatedList<TResult>(items, totalCount,  pageIndex, pageSize);
    }
} 


 