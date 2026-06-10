using DTOs;
using Entitys;
using Repository;

namespace Servers
{
    public interface IUserService
    {
        Task<ResultValidUser<(UserDTO user, string token)>> AddUser(UserDTO user, string password);
        void DeleteUser(int id);
        Task<UserDTO> GetUserById(int id);
        Task<(UserDTO user, string token)> Login(string email, string password);
        Task<ResultValidUser<(UserDTO user, string token)>> UpdateUser(int id, UserDTO user, string password);
        Task<bool> ExistsUserWithTheSameEmail(int id, string email);
        bool IsValidEmail(string email);
    }
}
