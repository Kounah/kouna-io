const fs = require('fs');
const path = require('path');
const process = require('process');

module.exports = function(dir) {
  let result = {};

  result.NAMESPACE_UUID = "e74f40a0-730d-11e8-922a-d1d434980626";

  result.links =  [
    { name: "Home",
      href: "/" },
    { name: "Content",
      subs: [
        { name: "About Me",
          href: "/about" },
        { name: "Anime",
          href: "/anime"}
        ] },
    { name: "Documents",
      subs: [
        { name: "List",
          href: "/docs/list"},
        { name: "My Docs",
          href: "/docs/mydocs"}
        ]},
    { name: "Awesome Art!",
      subs: [
        { name: "About",
          href: "/oko"}
        ]},
    { name: "Tools",
      subs: [
        { name: "Colors",
          href: "/tools/colors" }
      ]},
    { name: "Blade & Soul",
      subs: [
        { name: "Profile",
          href: "/bns/profile" }
      ]}
  ];

  result.docs = {
    itemsPerPage: 20,
    fileIcons: {
      'markdown': 'md',
      'plain-text': 'txt'
    },
    types: [
      'markdown',
      'plain-text'
    ],
    colors: [
      'red',
      'orange',
      'yellow',
      'green',
      'teal',
      'cyan',
      'blue',
      'purple',
      'blue-grey',
      'default'
    ]
  }

  result.ace = {
    path: path.join(dir, 'node_modules', 'ace-code-editor', 'dist')
  }

  return result;
}
