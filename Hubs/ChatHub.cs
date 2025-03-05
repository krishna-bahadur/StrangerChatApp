using Microsoft.AspNetCore.SignalR;

namespace StrangerChatApp.Hubs
{
    public class ChatHub : Hub
    {
        private static readonly List<string> WaitingUsers = new List<string>();
        private static readonly Dictionary<string, string> UserPairs = new Dictionary<string, string>();

        public override async Task OnConnectedAsync()
        {
            string connectionId = Context.ConnectionId;

            if (WaitingUsers.Count > 0)
            {
                string matchUser = WaitingUsers[0];
                WaitingUsers.RemoveAt(0);

                UserPairs[connectionId] = matchUser;
                UserPairs[matchUser] = connectionId;

                await Clients.Client(connectionId).SendAsync("MatchedWithUser");
                await Clients.Client(matchUser).SendAsync("MatchedWithUser");
            }
            else
            {
                WaitingUsers.Add(connectionId);
            }
            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            string connectionId = Context.ConnectionId;

            WaitingUsers.Remove(connectionId);

            if (UserPairs.ContainsKey(connectionId))
            {
                string matachUser = UserPairs[connectionId];
                UserPairs.Remove(connectionId);
                UserPairs.Remove(matachUser);

                await Clients.Client(matachUser).SendAsync("UserDisconnected");

            }
            await base.OnDisconnectedAsync(exception);
        }

        public async Task SendMessage(string message)
        {
            string sender = Context.ConnectionId;

            if (UserPairs.ContainsKey(sender))
            {
                string receiver = UserPairs[sender];
                await Clients.Client(receiver).SendAsync("ReceiveMessage", message);
            }
        }
    }
}
