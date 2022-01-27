// entries.js (utf-8)
// 
// Edited by: RR-DSE
// Timestamp: 22-01-27 00:41:27

const ENTRIES = [
  {
    "text": "This is an example of a simple text entry."
  },
  {
    "text": "This is another example of a simple text entry."
  },
  {
    "heading": "Section example",
    "heading_level": 1,
    "text": "This is an example of a section header text. The user wrote: {Text to be included/example}.",
    "entries" : [
      {
        "text": "This is an example of an entry text. The user wrote: {Text to be included/example}. Then, the user also wrote: {Text to be included/example}."
      },
      {
        "text": "This is an example of an another entry text. The user wrote: {Text to be included/example}."
      },
    ] ,
    "options": [
      {
        "caption": "Subsection example",
        "heading": "Subsection example",
        "heading_level": 2,
        "text": "This is an example of a subsection header text. The user wrote: {Text to be included/example}.",
        "options": [
          {
            "caption": "Free entry...",
            "text": "{Text to be included/Example}"
          }
        ]
      }
    ]
  },
  {
    "heading": "Section example",
    "heading_level": 0,
    "text": "This is an example of a section header text, for a section without heading counters.",
    "entries" : [
      {
        "text": "This is an example of an entry text."
      }
    ],
    "options": [
      {
        "caption": "Entry example",
        "text": "This is an example of an entry.",
      },
      {
        "caption": "Unordered list example",
        "text": "This is an example of an unordered list. The items are:",
        "type": "list-unordered",
        "options": [
          {
            "caption": "List item example",
            "text": "This is an example of a list item"
          },
          {
            "caption": "Unordered sub-list example",
            "type": "list-unordered",
            "text": "This is an example of an unordered sub-list. The items are:",
            "options": [
              {
                "caption": "List item example",
                "text": "This is an example of a list item"
              }
            ]
          }
        ]
      },
      {
        "caption": "Ordered list example",
        "text": "This is an example of a ordered list. The items are:",
        "type": "list-ordered",
        "options": [
          {
            "caption": "List item example",
            "text": "This is an example of a list item"
          },
          {
            "caption": "Ordered sub-list example",
            "text": "This is an example of an ordered sub-list. The items are:",
            "type": "list-ordered",
            "options": [
              {
                "caption": "List item example",
                "text": "This is an example of a list item"
              }
            ]
          },
          {
            "caption": "Unordered sub-list example",
            "text": "This is an example of an unordered sub-list. The items are:",
            "type": "list-unordered",
            "options": [
              {
                "caption": "List item example",
                "text": "This is an example of a list item"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "text": "This is an example of an entry group without heading.",
    "options": [
      {
        "caption": "Free entry...",
        "text": "{Text to be included/Example}"
      }
    ]
  },
];
