
        const user = localStorage.getItem("user");
        if(!user || !JSON.parse(user).is_admin){window.location.href="./connexion.html";}
    