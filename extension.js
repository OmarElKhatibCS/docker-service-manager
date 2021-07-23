/* extension.js
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * SPDX-License-Identifier: GPL-2.0-or-later
 */

/* exported init */

const GETTEXT_DOMAIN = 'my-indicator-extension';

const { GObject, St } = imports.gi;
const Me = imports.misc.extensionUtils.getCurrentExtension();
const Gio = imports.gi.Gio;

const Gettext = imports.gettext.domain(GETTEXT_DOMAIN);
const _ = Gettext.gettext;

const ExtensionUtils = imports.misc.extensionUtils;
const Main = imports.ui.main;
const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;
const GLib = imports.gi.GLib;

const Indicator = GObject.registerClass(
class Indicator extends PanelMenu.Button {
    _init() {
        super._init(0.0, _('My Shiny Indicator'));

	let gicon = Gio.icon_new_for_string(Me.path + "/icons/docker.png");

        this.add_child(new St.Icon({gicon}));

        let startDocker = new PopupMenu.PopupMenuItem(_('Start Docker'));
	let stopDocker = new PopupMenu.PopupMenuItem(_('Stop Docker'));

	startDocker.connect('button_press_event', async () => execCommandAndNotify(['systemctl','start','docker'],'Docker service started!'));
	stopDocker.connect('button_press_event', async () => execCommandAndNotify(['systemctl','stop','docker.socket'],'Docker service stoped!'));

        this.menu.addMenuItem(startDocker);
        this.menu.addMenuItem(stopDocker);
    }
});

const execCommandAndNotify = (args , msg) => {
	try {
		execCommand(args).then( () => {
			Main.notify(msg);
		})
	} catch(e) {
		Main.notify(e);
	}
}

const execCommand = (args) => {
    let proc = Gio.Subprocess.new(
        ['pkexec'].concat(args),
        Gio.SubprocessFlags.STDOUT_PIPE | Gio.SubprocessFlags.STDIN_PIPE
    );

    return new Promise((resolve, reject) => {
        proc.communicate_utf8_async(null, null, (proc, res) => {
            try {
				// will return ok
                resolve(proc.communicate_utf8_finish(res)[0]);
            } catch (e) {
                reject(e);
            }
        });
    });
}

class Extension {
    constructor(uuid) {
        this._uuid = uuid;

        ExtensionUtils.initTranslations(GETTEXT_DOMAIN);
    }

    enable() {
        this._indicator = new Indicator();
        Main.panel.addToStatusArea(this._uuid, this._indicator);
    }

    disable() {
        this._indicator.destroy();
        this._indicator = null;
    }
}

function init(meta) {
    return new Extension(meta.uuid);
}
