using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Sakkinny.Models
{
    public class DataContext : IdentityDbContext<ApplicationUser>
    {
        public DbSet<Apartment> Apartments { get; set; } = null!;
        public DbSet<Renter> Renters { get; set; } = null!;
        public DbSet<ApartmentImage> ApartmentImages { get; set; } = null!;

        public DataContext(DbContextOptions<DataContext> options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<ApplicationUser>().ToTable("Users");

            modelBuilder.Entity<Apartment>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id)
                    .ValueGeneratedOnAdd();

                entity.Property(e => e.Title)
                    .IsRequired()
                    .HasMaxLength(100);

                entity.Property(e => e.SubTitle)
                    .HasMaxLength(500);

                entity.Property(e => e.Location)
                    .IsRequired()
                    .HasMaxLength(150);

                entity.Property(e => e.RoomsNumber)
                    .IsRequired(false);

                entity.Property(e => e.RoomsAvailable)
                    .IsRequired();

                entity.Property(e => e.Price)
                    .HasColumnType("decimal(18,2)")
                    .IsRequired(false);

                entity.Property(e => e.RentalType)
                    .IsRequired()
                    .HasDefaultValue(RentalType.ByRoom);

                entity.Property(e => e.RentalStartDate)
                    .IsRequired(false);

                entity.Property(e => e.RentalEndDate)
                    .IsRequired(false);

                entity.Property(e => e.IsDeleted)
                    .HasDefaultValue(false);

                entity.Property(e => e.CreationTime)
                    .HasDefaultValueSql("CURRENT_TIMESTAMP");

                entity.Property(e => e.DeletionTime)
                    .IsRequired(false);

                entity.Property(e => e.OwnerId)
                    .IsRequired()
                    .HasMaxLength(450);

                entity.HasMany(a => a.Images)
                    .WithOne(ai => ai.Apartment)
                    .HasForeignKey(ai => ai.ApartmentId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<ApartmentImage>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id)
                    .ValueGeneratedOnAdd();

                entity.Property(e => e.ImageData)
                    .IsRequired();

                entity.HasOne(ai => ai.Apartment)
                    .WithMany(a => a.Images)
                    .HasForeignKey(ai => ai.ApartmentId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<Renter>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id)
                    .ValueGeneratedOnAdd();

                entity.Property(e => e.UserId)
                    .IsRequired()
                    .HasMaxLength(450);

                entity.Property(e => e.ApartmentId)
                    .IsRequired();

                entity.Property(e => e.RentalDate)
                    .IsRequired()
                    .HasDefaultValueSql("CURRENT_TIMESTAMP");

                entity.Property(e => e.RoomsRented)
                    .IsRequired()
                    .HasDefaultValue(1);

                entity.Property(e => e.IsActive)
                    .IsRequired()
                    .HasDefaultValue(true);

                entity.HasOne(r => r.User)
                    .WithMany()
                    .HasForeignKey(r => r.UserId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(r => r.Apartment)
                    .WithMany(a => a.Renters)
                    .HasForeignKey(r => r.ApartmentId)
                    .OnDelete(DeleteBehavior.Cascade);
            });
        }
    }
}