# docker-service-manager
a simple gnome 40 extention that will start and stop docker service instead of making it run in startup

after cloning the repo open terminal in repo folder 

```bash
gnome-extensions pack --extra-source icons
```
this will produce an `zip` file with name `docker-servic-manager@elkhatib.omar.com.shell-extension.zip` , after that  run
```bash
gnome-extensions install docker-servic-manager@elkhatib.omar.com.shell-extension.zip
```
and now it will be installed , after than press `ALT+F2` (you may have changed this keybinding) this will open `run command` type `r` and this will restart the gnome shell , or you can logout and login again to take effects. <br>
Go to gnome extentions and enable it , a new docker Icon will appear in the status bar. <br>
