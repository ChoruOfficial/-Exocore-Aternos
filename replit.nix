{ pkgs }: {
  deps = [
    pkgs.nodejs-22_x
    pkgs.wget
    pkgs.unzip
    pkgs.chromium
    pkgs.libdrm
    pkgs.glib
    pkgs.gobject-introspection
    pkgs.nss
    pkgs.xorg.libX11
    pkgs.xorg.libxcb
    pkgs.atk
    pkgs.at-spi2-core
  ];
}
