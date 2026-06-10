namespace Servers;

using Entitys;
using Repository;
using DTOs;
using AutoMapper;
using System.ComponentModel.DataAnnotations;
using Microsoft.Extensions.Caching.Distributed;
using System.Text.Json;
using Microsoft.Extensions.Configuration;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using BC = BCrypt.Net.BCrypt;
using Microsoft.IdentityModel.Tokens;

public class UserService : IUserService
{
    private readonly IUserRepository _userRepository;
    private readonly IPasswordService _passwordService;
    private readonly IMapper _mapper;
    private readonly IDistributedCache _cache;
    private readonly IConfiguration _configuration;

    public UserService(IMapper mapper, IUserRepository userRepository, IPasswordService passwordService, IDistributedCache cache, IConfiguration configuration)
    {
        _userRepository = userRepository;
        _passwordService = passwordService;
        _mapper = mapper;
        _cache = cache;
        _configuration = configuration;
    }

    public async Task<bool> ExistsUserWithTheSameEmail(int id, string email)
    {
        User user = await _userRepository.GetUserByEmail(email);
        return user != null && user.UserId != id;
    }

    public async Task<UserDTO> GetUserById(int id)
    {
        string cacheKey = $"user_{id}";
        try
        {
            var cached = await _cache.GetStringAsync(cacheKey);
            if (cached != null)
                return JsonSerializer.Deserialize<UserDTO>(cached);
        }
        catch (Exception ex) { Console.WriteLine($"Redis error on Get: {ex.Message}"); }

        var user = _mapper.Map<User, UserDTO>(await _userRepository.GetUserById(id));
        if (user != null)
            await SetCacheAsync(cacheKey, user);
        return user;
    }

    public async Task<ResultValidUser<(UserDTO user, string token)>> AddUser(UserDTO userDto, string password)
    {
        if (!IsValidEmail(userDto.UserEmail))
            return new ResultValidUser<(UserDTO, string)>(false, false, true, (null, null));

        var passwordCheck = _passwordService.CheckPassword(password);
        if (passwordCheck.Level < 3)
            return new ResultValidUser<(UserDTO, string)>(true, false, false, (null, null));

        if (await ExistsUserWithTheSameEmail(userDto.UserId, userDto.UserEmail))
            return new ResultValidUser<(UserDTO, string)>(false, true, false, (null, null));

        User user1 = _mapper.Map<UserDTO, User>(userDto);
        user1.UserPassword = BC.HashPassword(password);
        UserDTO user2 = _mapper.Map<User, UserDTO>(await _userRepository.AddUser(user1));
        await InvalidateUserCache(user2.UserId);
        string token = GenerateToken(user2);
        return new ResultValidUser<(UserDTO, string)>(false, false, false, (user2, token));
    }

    public async Task<ResultValidUser<(UserDTO user, string token)>> UpdateUser(int id, UserDTO userDto, string password)
    {
        if (!IsValidEmail(userDto.UserEmail))
            return new ResultValidUser<(UserDTO, string)>(false, false, true, (null, null));

        var passwordCheck = _passwordService.CheckPassword(password);
        if (passwordCheck.Level < 3)
            return new ResultValidUser<(UserDTO, string)>(true, false, false, (null, null));

        if (await ExistsUserWithTheSameEmail(id, userDto.UserEmail))
            return new ResultValidUser<(UserDTO, string)>(false, true, false, (null, null));

        User userToUpdate = _mapper.Map<UserDTO, User>(userDto);
        userToUpdate.UserPassword = BC.HashPassword(password);
        userToUpdate.UserId = id;
        await _userRepository.UpdateUser(userToUpdate);
        await InvalidateUserCache(id);

        var updated = _mapper.Map<User, UserDTO>(await _userRepository.GetUserById(id));
        string token = GenerateToken(updated);
        return new ResultValidUser<(UserDTO, string)>(false, false, false, (updated, token));
    }

    public async Task<(UserDTO user, string token)> Login(string email, string password)
    {
        User userEntity = await _userRepository.GetUserByEmail(email);
        if (userEntity == null || !BC.Verify(password, userEntity.UserPassword))
            return (null, null);
        UserDTO user = _mapper.Map<User, UserDTO>(userEntity);
        string token = GenerateToken(user);
        return (user, token);
    }

    public void DeleteUser(int id) => _userRepository.DeleteUser(id);

    public bool IsValidEmail(string email) => new EmailAddressAttribute().IsValid(email);

    private string GenerateToken(UserDTO user)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
            new Claim(ClaimTypes.Email, user.UserEmail),
            new Claim(ClaimTypes.GivenName, user.UserFirstName ?? ""),
            new Claim(ClaimTypes.Role, user.Role == "admin" ? "Admin" : "User")
        };
        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddHours(1),
            signingCredentials: new SigningCredentials(key, SecurityAlgorithms.HmacSha256)
        );
        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    private async Task InvalidateUserCache(int userId)
    {
        try { await _cache.RemoveAsync($"user_{userId}"); }
        catch (Exception ex) { Console.WriteLine($"Redis error on Invalidate: {ex.Message}"); }
    }

    private async Task SetCacheAsync(string cacheKey, UserDTO user)
    {
        try
        {
            var ttl = int.TryParse(_configuration["Redis:TTL"], out var t) ? t : 3600;
            var options = new DistributedCacheEntryOptions
            {
                AbsoluteExpirationRelativeToNow = TimeSpan.FromSeconds(ttl)
            };
            await _cache.SetStringAsync(cacheKey, JsonSerializer.Serialize(user), options);
        }
        catch (Exception ex) { Console.WriteLine($"Redis error on Set: {ex.Message}"); }
    }
}
