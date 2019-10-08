<?php

namespace Emsifa\ApiWilayah;

use InvalidArgumentException;

class Helper
{

    public static function resolvePath(string $path): string
    {
        return preg_replace("/\\|\//", DIRECTORY_SEPARATOR, $path);
    }

    public static function removeFileOrDirectory(string $path)
    {
        if (!file_exists($path)) {
            throw new InvalidArgumentException("Cannot remove file or directory. File '{$path}' doesn't exists.");
        }

        if (is_file($path)) {
            return unlink($path);
        }

        $cmd = "rm -rf {$path}";
        shell_exec($cmd);
    }

    public static function isWindows()
    {
        return strtoupper(substr(PHP_OS, 0, 3)) === 'WIN';
    }

}
