import { App, MarkdownPostProcessor, MarkdownPostProcessorContext, MarkdownPreviewRenderer, MarkdownRenderer, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';


interface ScalesChordsPluginSettings {
  instrument: string;
}

const DEFAULT_SETTINGS: ScalesChordsPluginSettings = {
  instrument: 'piano'
}

export default class ScalesChordsPlugin extends Plugin {
  settings: ScalesChordsPluginSettings;

  async onload() {
    const chordRegex = new RegExp("\[:(.*?):\]");
    console.log('loading ScalesChords');

    //@ts-ignore
    window.scales_chords_api_debug = true;

    await this.loadSettings();

    this.addSettingTab(new SettingTab(this.app, this));

    this.registerMarkdownCodeBlockProcessor("tab", (source, el, ctx)=>{
      let chords = new Set();
      let pre = document.createElement("pre")

      let lines = source.split("\n")
      for (var line of lines) {
        // parse tab lines out into separate tokens, preserving white space
        if (line[line.length-1] == "%") {
          let tokens = [];
          var cur_token = '';
          var last_char = '';
          for (var char of line.split("")) {
            if (char == "%") char = " ";
            if ((last_char == ' ' && char != ' ') || (last_char != ' ' && char == ' ')) {
              tokens.push(cur_token);
              cur_token = '';
            }
            cur_token += char;
            last_char = char;
          }
          tokens.push(cur_token);
          let div = document.createElement('div');
          for (var token of tokens) {
            if (token[0] != ' ') {
              chords.add(token);
              let e = document.createElement('b');
              e.innerHTML = token;
              let _token = token;
              this.registerDomEvent(e, 'click', (evt)=>{
                new TabModal(this.app, _token, this.settings.instrument).open();
              });
              div.appendChild(e);
            } else {
              div.appendChild(document.createTextNode(token));
            }
          }
          pre.appendChild(div);
        } else {
          let line_elem = document.createTextNode(line+"\n");
          pre.appendChild(line_elem);
        }
      }

      el.appendChild(pre)
      for (var chord of chords) {
        if (chord == '') continue;
        append_chord_image(el, chord, this.settings.instrument);
      }
    });
  }

  onunload() {
    console.log('unloading plugin');
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }
}

class TabModal extends Modal {
  chord: string;
  constructor(app: App, _chord: string, _instrument: string) {
    super(app);
    this.instrument = _instrument;
    this.chord = _chord;
  }

  onOpen() {
    let {contentEl} = this;
    append_chord_image(contentEl, this.chord, this.instrument);
  }

  onClose() {
    let {contentEl} = this;
    contentEl.empty();
  }
}

class SettingTab extends PluginSettingTab {
  plugin: ScalesChordsPlugin;

  constructor(app: App, plugin: MyPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    let {containerEl} = this;

    containerEl.empty();

    containerEl.createEl('h2', {text: 'Settings for Scales and Chords'});

    new Setting(containerEl)
      .setName('instrument')
      .setDesc('musical instrument to render')
      .addText(text => text
        .setPlaceholder('Enter instrument')
        .setValue(this.plugin.settings.instrument)
        .onChange(async (value) => {
          this.plugin.settings.instrument = value;
          await this.plugin.saveSettings();
        }));
  }
}



function append_chord_image(el: Any, chord: string, instrument: string) {
  postData(
    "https://www.scales-chords.com/api/scapi.1.3.php",
    {
      'id': 'scapiobjid1',
      'class': 'scales_chords_api',
      'chord': chord,
      'instrument': instrument
    }
  )
    .then(res=>res.text())
    .then(text=>{
      let arr = text.split("###RAWR###");
      let inner = document.createElement("div");
      inner.innerHTML = arr[arr.length-1];
      el.appendChild(inner);
    });
}

function postData(url = '', data = {}) {
  // Default options are marked with *
  const response = fetch(url, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer',
    body: serialize(data) // body data type must match "Content-Type" header
  });
  return response;
}

function serialize(obj: Any) {
  var str = [];
  for(var p in obj)
     str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
  return str.join("&");
}
