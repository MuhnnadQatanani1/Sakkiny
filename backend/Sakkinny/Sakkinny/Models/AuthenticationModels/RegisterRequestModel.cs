using System.ComponentModel.DataAnnotations;
using Sakkinny.Enums;

namespace Sakkinny.Models.AuthenticationModels
{
	public class RegisterRequestModel
	{
		[Required(ErrorMessage = "Full name is required.")]
		public string FullName { get; set; }

		[Required(ErrorMessage = "Email is required.")]
		[EmailAddress(ErrorMessage = "Invalid email format.")]
		public string Email { get; set; }

		public UserRole Role { get; set; }

		[Required(ErrorMessage = "Password is required.")]
		[StringLength(100, MinimumLength = 6, ErrorMessage = "Password must be at least 6 characters long.")]
		public string Password { get; set; }

		[Required(ErrorMessage = "Confirm password is required.")]
		[Compare("Password", ErrorMessage = "Passwords do not match.")]
		public string CoPassword { get; set; }
	}
}
