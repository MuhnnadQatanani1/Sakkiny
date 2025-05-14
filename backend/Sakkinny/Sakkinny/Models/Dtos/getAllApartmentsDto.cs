namespace Sakkinny.Models.Dtos
{
	public class getAllApartmentsDto
	{
		private const int MaxPageSize = 100;
		public int PageIndex { get; set; } = 1;
		private int _pageSize = 6;
		public int PageSize
		{
			get { return _pageSize; }
			set { _pageSize = value > MaxPageSize ? MaxPageSize : value; }
		}
		public string? SearchTerm { get; set; }

		public ICollection<KeyValuePair<string, List<string>>>? ColumnFilters { get; set; }
	}
}
