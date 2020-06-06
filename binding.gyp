{
  "targets": [
    {
      "target_name": "ws281x",
      "sources": [
        "wrapper.cc",
      ],
      "dependencies": ["<!(node -p \"require('node-addon-api').gyp\")", "rpi_libws2811"],
      "include_dirs": [
        "<!@(node -p \"require('node-addon-api').include\")",
      ],
      "defines": [ 'NAPI_DISABLE_CPP_EXCEPTIONS' ],
    },
    {
      'target_name': 'rpi_libws2811',
      'type': 'static_library',
      'sources': [
        './rpi_ws281x/ws2811.c',
        './rpi_ws281x/pwm.c',
        './rpi_ws281x/dma.c',
        './rpi_ws281x/pcm.c',
        './rpi_ws281x/pwm.c',
        './rpi_ws281x/mailbox.c',
        './rpi_ws281x/rpihw.c',
      ],
      'cflags': ['-O2', '-Wall']
    },
    {
      'target_name':'action_after_build',
      'type': 'none',
      'dependencies': ['ws281x'],
      'copies': [{
        'destination': './binding/',
        'files': [
          '<(PRODUCT_DIR)/ws281x.node'
        ]
      }]
    }
  ],
}
