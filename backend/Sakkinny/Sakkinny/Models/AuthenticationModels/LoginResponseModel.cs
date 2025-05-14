using Sakkinny.Enums;

namespace Sakkinny.Models.AuthenticationModels
{
	public class LoginResponseModel
	{
		public string UserId { get; set; }

        public string FullName { get; set; }

        public string Token { get; set; }
		public string RefreshToken { get; set; }
		public string Email { get; set; }
		public string Message { get; set; }
		public int Status { get; set; }
		public ICollection<string> Roles { get; set; }
	}
}
