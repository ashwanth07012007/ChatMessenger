import "./UserList.css";

function UserList({
    users,
    onSelectUser,
    currentUsername
}) {
    return (
        <div className="user-list">

            <h3 className="user-list-title">
                Users
            </h3>

            {users
                .filter(
                    user =>
                        user.username !== currentUsername
                )
                .map((user) => (

                    <div
                        key={user.id}
                        className="user-item"
                        onClick={() =>
                            onSelectUser(user)
                        }
                    >

                        {/* PROFILE IMAGE */}
                        <div className="user-avatar">

                            {user.profileImage ? (
                                <img
                                    src={user.profileImage}
                                    alt="Profile"
                                />
                            ) : (
                                user.username
                                    ?.charAt(0)
                                    .toUpperCase()
                            )}

                        </div>


                        {/* USER DETAILS */}
                        <div className="user-info">

                            <span className="user-name">
                                {user.username}
                            </span>

                            <span
                                className={
                                    user.status === "ONLINE"
                                        ? "user-status online"
                                        : "user-status offline"
                                }
                            >
                                {user.status === "ONLINE"
                                    ? "Online"
                                    : "Offline"}
                            </span>

                        </div>

                    </div>

                ))}

        </div>
    );
}

export default UserList;