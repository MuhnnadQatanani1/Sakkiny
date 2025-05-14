
namespace Sakkinny.Models.AuthenticationModels
{
	public class getUserByIdResponseModel
	{
		public string UserId { get; set; }
		public string Email { get; set; }
		public string FullName { get; set; }
		public string ProfilePictureUrl { get; set; }
		public ICollection<string> Roles { get; set; }
	}
}
