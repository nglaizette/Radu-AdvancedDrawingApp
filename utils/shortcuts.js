const shortcuts = [
   { control: false, key: "r", action: selectRectTool },
   { control: false, key: "p", action: selectPathTool },
   { control: false, key: "v", action: selectSelectTool },
   { control: false, key: "o", action: selectOvalTool },
   { control: false, key: "t", action: selectTextTool },
   { control: false, key: "d", action: resetColors },
   { control: false, key: "x", action: swapColors },   
   { control: true, key: "z", action: HistoryTools.undo },
   { control: true, key: "y", action: HistoryTools.redo},
   { control: true, key: "l", action: DocumentTools.load },
   { control: true, key: "s", action: DocumentTools.save},
   { control: true, key: "a", action: selectAll },
   { control: true, key: "c", action: copy },
   { control: true, key: "v", action: paste },
   { constol: true, key: "d", action: duplicate },
   { control: false, key: "Delete", action: deleteSelectedShapes},
   { control: false, key: "Backspace", action: deleteSelectedShapes}
];

function isShortcut(control, key) {
   return shortcuts.find((s) => s.key === key && s.control === control);
}

function executeShortcut(control, key) {
   const shortcut = isShortcut(control, key);
   if (shortcut) {
      shortcut.action();
   }
}
