using AuthService.Application.Interfaces;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.Extensions.Configuration;
using System.Text.RegularExpressions;

namespace AuthService.Application.Services;

public class CloudinaryService(IConfiguration configuration) : ICloudinaryService
{
    private readonly Cloudinary _cloudinary = new(new Account(
        configuration["CloudinarySettings:CloudName"],
        configuration["CloudinarySettings:ApiKey"],
        configuration["CloudinarySettings:ApiSecret"]
    ));

    private readonly string _uploadBaseUrl = BuildUploadBaseUrl(configuration);

    public async Task<string> UploadImageAsync(IFileData imageFile, string fileName)
    {
        try
        {
            using var stream = new MemoryStream(imageFile.Data);

            var folder = configuration["CloudinarySettings:Folder"]
                         ?? "auth_service/profiles";

            var cleanName = Path.GetFileNameWithoutExtension(fileName);

            var publicId = $"{folder}/{cleanName}";

            var uploadParams = new ImageUploadParams
            {
                File = new FileDescription(imageFile.FileName, stream),
                PublicId = publicId,
            };

            var uploadResult = await _cloudinary.UploadAsync(uploadParams);

            if (uploadResult.Error != null)
                throw new InvalidOperationException($"Error uploading image: {uploadResult.Error.Message}");

            return $"v{uploadResult.Version}/{uploadResult.PublicId}.{uploadResult.Format}";
        }
        catch (Exception ex)
        {
            throw new InvalidOperationException($"Failed to upload image to Cloudinary: {ex.Message}", ex);
        }
    }

    public async Task<bool> DeleteImageAsync(string fileName)
    {
        try
        {
            var folder = configuration["CloudinarySettings:Folder"]
                         ?? "auth_service/profiles";

            var withoutVersion = fileName.Contains('/')
                ? string.Join('/', fileName.Split('/').Skip(1))
                : fileName;

            var withoutExtension = Path.Combine(
                Path.GetDirectoryName(withoutVersion) ?? "",
                Path.GetFileNameWithoutExtension(withoutVersion)
            ).Replace("\\", "/");


            var deleteParams = new DelResParams
            {
                PublicIds = [withoutExtension]
            };

            var result = await _cloudinary.DeleteResourcesAsync(deleteParams);
            return result.Deleted?.ContainsKey(withoutExtension) == true;
        }
        catch
        {
            return false;
        }
    }


    public string GetDefaultAvatarUrl()
    {
        var configuredDefault = configuration["CloudinarySettings:DefaultAvatarPath"];
        if (string.IsNullOrWhiteSpace(configuredDefault))
        {
            return string.Empty;
        }

        if (Uri.TryCreate(configuredDefault, UriKind.Absolute, out _))
        {
            return configuredDefault;
        }

        var defaultPath = configuredDefault.Trim().TrimStart('/');

        // Si solo hay un nombre de archivo (sin carpeta/ruta), usar fallback local del frontend
        // para evitar 404 de assets no existentes en Cloudinary.
        if (!defaultPath.Contains('/'))
        {
            return string.Empty;
        }

        return $"{_uploadBaseUrl}/{defaultPath}";
    } 

    public string GetFullImageUrl(string fileName)
    {
        if (string.IsNullOrWhiteSpace(fileName))
        {
            return GetDefaultAvatarUrl();
        }

        if (Uri.TryCreate(fileName, UriKind.Absolute, out _))
        {
            if (IsDefaultAvatarReference(fileName))
            {
                return string.Empty;
            }

            return fileName;
        }

        var cleanPath = fileName.Trim().TrimStart('/');
        return $"{_uploadBaseUrl}/w_400,h_400,c_fill,g_auto,q_auto,f_auto/{cleanPath}";
    }

    private static string BuildUploadBaseUrl(IConfiguration configuration)
    {
        var configuredBase = configuration["CloudinarySettings:BaseUrl"]?.Trim();
        if (!string.IsNullOrWhiteSpace(configuredBase))
        {
            var match = Regex.Match(configuredBase, @"^(https?://res\.cloudinary\.com/[^/]+/image/upload)", RegexOptions.IgnoreCase);
            if (match.Success)
            {
                return match.Groups[1].Value.TrimEnd('/');
            }
        }

        var cloudName = configuration["CloudinarySettings:CloudName"]?.Trim();
        if (!string.IsNullOrWhiteSpace(cloudName))
        {
            return $"https://res.cloudinary.com/{cloudName}/image/upload";
        }

        return "https://res.cloudinary.com/demo/image/upload";
    }

    private static bool IsDefaultAvatarReference(string value)
    {
        var normalized = value.ToLowerInvariant();
        return normalized.Contains("avatardefault-1749508519496") || normalized.Contains("avatar_default");
    }

}