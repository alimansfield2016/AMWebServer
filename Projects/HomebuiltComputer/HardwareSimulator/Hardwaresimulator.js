const READ = 0;
const WRITE = 1;

//Exception constants
const MEMORY_OUT_OF_PAGE = 0;


let instrCycle = 0;
let PC = 0;
let Paged = false;
let PID;
let pager = new Array(65536);
const RAM = new Array(268435456);

const 64x32Reg = new Array(64);

let Halt = false;


let ASCII =
[
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,	// Char 000 (.)
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,	// Char 001 (.)
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,	// Char 002 (.)
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,	// Char 003 (.)
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,	// Char 004 (.)
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,	// Char 005 (.)
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,	// Char 006 (.)
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,	// Char 007 (.)
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,	// Char 008 (.)
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,	// Char 009 (.)
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,	// Char 010 (.)
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,	// Char 011 (.)
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,	// Char 012 (.)
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,	// Char 013 (.)
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,	// Char 014 (.)
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,	// Char 015 (.)
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,	// Char 016 (.)
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,	// Char 017 (.)
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,	// Char 018 (.)
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,	// Char 019 (.)
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,	// Char 020 (.)
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,	// Char 021 (.)
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,	// Char 022 (.)
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,	// Char 023 (.)
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,	// Char 024 (.)
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,	// Char 025 (.)
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,	// Char 026 (.)
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,	// Char 027 (.)
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,	// Char 028 (.)
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,	// Char 029 (.)
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,	// Char 030 (.)
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,	// Char 031 (.)
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,	// Char 032 ( )
	0x00, 0x18, 0x18, 0x18, 0x18, 0x00, 0x18, 0x18,	// Char 033 (!)
	0x00, 0x6C, 0x24, 0x48, 0x00, 0x00, 0x00, 0x00,	// Char 034 (")
	0x00, 0x00, 0x28, 0x7C, 0x28, 0x7C, 0x28, 0x00,	// Char 035 (#)
	0x00, 0x10, 0x7C, 0xD2, 0x38, 0x96, 0x7C, 0x10,	// Char 036 ($)
	0x00, 0x42, 0xA4, 0x48, 0x10, 0x24, 0x4A, 0x84,	// Char 037 (%)
	0x00, 0x20, 0x50, 0x30, 0x4A, 0x8C, 0x9A, 0x70,	// Char 038 (&)
	0x00, 0x30, 0x10, 0x20, 0x00, 0x00, 0x00, 0x00,	// Char 039 (')
	0x00, 0x0C, 0x18, 0x18, 0x18, 0x18, 0x18, 0x0C,	// Char 040 (()
	0x00, 0x30, 0x18, 0x18, 0x18, 0x18, 0x18, 0x30,	// Char 041 ())
	0x00, 0x28, 0x10, 0x28, 0x00, 0x00, 0x00, 0x00,	// Char 042 (*)
	0x00, 0x00, 0x10, 0x10, 0x7C, 0x10, 0x10, 0x00,	// Char 043 (+)
	0x00, 0x00, 0x00, 0x00, 0x00, 0x30, 0x10, 0x20,	// Char 044 (,)
	0x00, 0x00, 0x00, 0x00, 0x7C, 0x00, 0x00, 0x00,	// Char 045 (-)
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x30, 0x30,	// Char 046 (.)
	0x00, 0x06, 0x0E, 0x1C, 0x38, 0x70, 0xE0, 0xC0,	// Char 047 (/)
	0x00, 0x7C, 0xC6, 0xCE, 0xD6, 0xE6, 0xC6, 0x7C,	// Char 048 (0)
	0x00, 0x18, 0x38, 0x18, 0x18, 0x18, 0x18, 0x3C,	// Char 049 (1)
	0x00, 0x3C, 0x66, 0x06, 0x0C, 0x18, 0x30, 0x7E,	// Char 050 (2)
	0x00, 0x3C, 0x06, 0x06, 0x3C, 0x06, 0x06, 0x3C,	// Char 051 (3)
	0x00, 0x00, 0x6C, 0x6C, 0x6C, 0x7E, 0x0C, 0x0C,	// Char 052 (4)
	0x00, 0x7C, 0x60, 0x60, 0x78, 0x0C, 0x4C, 0x78,	// Char 053 (5)
	0x00, 0x3C, 0x66, 0x60, 0x7C, 0x66, 0x66, 0x3C,	// Char 054 (6)
	0x00, 0x7E, 0x06, 0x0C, 0x18, 0x18, 0x18, 0x18,	// Char 055 (7)
	0x00, 0x3C, 0x66, 0x66, 0x3C, 0x66, 0x66, 0x3C,	// Char 056 (8)
	0x00, 0x3C, 0x66, 0x66, 0x3E, 0x06, 0x66, 0x3C,	// Char 057 (9)
	0x00, 0x00, 0x18, 0x18, 0x00, 0x18, 0x18, 0x00,	// Char 058 (:)
	0x00, 0x00, 0x18, 0x18, 0x00, 0x18, 0x08, 0x10,	// Char 059 (;)
	0x00, 0x06, 0x0C, 0x18, 0x30, 0x18, 0x0C, 0x06,	// Char 060 (<)
	0x00, 0x00, 0x00, 0x3C, 0x00, 0x3C, 0x00, 0x00,	// Char 061 (=)
	0x00, 0x60, 0x30, 0x18, 0x0C, 0x18, 0x30, 0x60,	// Char 062 (>)
	0x00, 0x78, 0x04, 0x04, 0x38, 0x30, 0x00, 0x30,	// Char 063 (?)
	0x00, 0x7C, 0xC2, 0x9A, 0xAA, 0x9E, 0xC0, 0x7E,	// Char 064 (@)
	0x00, 0x38, 0x6C, 0xC6, 0xC6, 0xFE, 0xC6, 0xC6,	// Char 065 (A)
	0x00, 0xFC, 0xC6, 0xC6, 0xFC, 0xC6, 0xC6, 0xFC,	// Char 066 (B)
	0x00, 0x3C, 0x66, 0xC0, 0xC0, 0xC0, 0x66, 0x3C,	// Char 067 (C)
	0x00, 0xF8, 0xCC, 0xC6, 0xC6, 0xC6, 0xCC, 0xF8,	// Char 068 (D)
	0x00, 0xFE, 0xC0, 0xC0, 0xF8, 0xC0, 0xC0, 0xFE,	// Char 069 (E)
	0x00, 0xFE, 0xC0, 0xC0, 0xF8, 0xC0, 0xC0, 0xC0,	// Char 070 (F)
	0x00, 0x3E, 0x60, 0xC0, 0xCE, 0xC6, 0x66, 0x3C,	// Char 071 (G)
	0x00, 0xC6, 0xC6, 0xC6, 0xFE, 0xC6, 0xC6, 0xC6,	// Char 072 (H)
	0x00, 0x7E, 0x18, 0x18, 0x18, 0x18, 0x18, 0x7E,	// Char 073 (I)
	0x00, 0x7E, 0x18, 0x18, 0x18, 0x18, 0xD8, 0x70,	// Char 074 (J)
	0x00, 0xC6, 0xCC, 0xD8, 0xF0, 0xF8, 0xDC, 0xCE,	// Char 075 (K)
	0x00, 0xC0, 0xC0, 0xC0, 0xC0, 0xC0, 0xC0, 0xFE,	// Char 076 (L)
	0x00, 0xC6, 0xEE, 0xFE, 0xD6, 0xC6, 0xC6, 0xC6,	// Char 077 (M)
	0x00, 0xC6, 0xE6, 0xF6, 0xFE, 0xDE, 0xCE, 0xC6,	// Char 078 (N)
	0x00, 0x7C, 0xC6, 0xC6, 0xC6, 0xC6, 0xC6, 0x7C,	// Char 079 (O)
	0x00, 0xFC, 0xC6, 0xC6, 0xFC, 0xC0, 0xC0, 0xC0,	// Char 080 (P)
	0x00, 0x7C, 0xC6, 0xC6, 0xC6, 0xDE, 0xCC, 0x7A,	// Char 081 (Q)
	0x00, 0xFC, 0xC6, 0xC6, 0xFC, 0xF8, 0xDC, 0xCE,	// Char 082 (R)
	0x00, 0x7C, 0xC6, 0xC0, 0x7C, 0x06, 0xC6, 0x7C,	// Char 083 (S)
	0x00, 0x7E, 0x18, 0x18, 0x18, 0x18, 0x18, 0x18,	// Char 084 (T)
	0x00, 0xC6, 0xC6, 0xC6, 0xC6, 0xC6, 0xC6, 0x7C,	// Char 085 (U)
	0x00, 0xC6, 0xC6, 0xC6, 0xC6, 0x6C, 0x38, 0x10,	// Char 086 (V)
	0x00, 0xC6, 0xC6, 0xC6, 0xD6, 0xFE, 0xEE, 0xC6,	// Char 087 (W)
	0x00, 0xC6, 0xEE, 0x7C, 0x38, 0x7C, 0xEE, 0xC6,	// Char 088 (X)
	0x00, 0xC6, 0xEE, 0x7C, 0x38, 0x70, 0xE0, 0xC0,	// Char 089 (Y)
	0x00, 0xFE, 0x06, 0x0C, 0x18, 0x30, 0x60, 0xFE,	// Char 090 (Z)
	0x00, 0x38, 0x30, 0x30, 0x30, 0x30, 0x30, 0x38,	// Char 091 ([)
	0x00, 0xC0, 0xE0, 0x70, 0x38, 0x1C, 0x0E, 0x06,	// Char 092 (\)
	0x00, 0x38, 0x18, 0x18, 0x18, 0x18, 0x18, 0x38,	// Char 093 (])
	0x00, 0x10, 0x38, 0x28, 0x00, 0x00, 0x00, 0x00,	// Char 094 (^)
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xFF,	// Char 095 (_)
	0x00, 0x18, 0x0C, 0x00, 0x00, 0x00, 0x00, 0x00,	// Char 096 (`)
	0x00, 0x00, 0x00, 0x7C, 0x06, 0x7E, 0xC6, 0x7E,	// Char 097 (a)
	0x00, 0xC0, 0xC0, 0xC0, 0xFC, 0xC6, 0xC6, 0xFC,	// Char 098 (b)
	0x00, 0x00, 0x00, 0x7C, 0xC6, 0xC0, 0xC6, 0x7C,	// Char 099 (c)
	0x00, 0x06, 0x06, 0x06, 0x7E, 0xC6, 0xC6, 0x7E,	// Char 100 (d)
	0x00, 0x00, 0x00, 0x7C, 0xC6, 0xF8, 0xC2, 0x7C,	// Char 101 (e)
	0x00, 0x1C, 0x32, 0x30, 0x78, 0x30, 0x30, 0x30,	// Char 102 (f)
	0x00, 0x00, 0x00, 0x7E, 0xC6, 0x7E, 0x06, 0xFC,	// Char 103 (g)
	0x00, 0xC0, 0xC0, 0xC0, 0xF8, 0xCC, 0xCC, 0xCC,	// Char 104 (h)
	0x00, 0x30, 0x00, 0x30, 0x30, 0x30, 0x30, 0x30,	// Char 105 (i)
	0x00, 0x0C, 0x00, 0x0C, 0x0C, 0x0C, 0x0C, 0x38,	// Char 106 (j)
	0x00, 0x00, 0xC8, 0xD8, 0xF0, 0xF0, 0xD8, 0xCC,	// Char 107 (k)
	0x00, 0x60, 0x60, 0x60, 0x60, 0x60, 0x60, 0x3C,	// Char 108 (l)
	0x00, 0x00, 0x00, 0xEC, 0xFE, 0xD6, 0xC6, 0xC6,	// Char 109 (m)
	0x00, 0x00, 0x00, 0x7C, 0x66, 0x66, 0x66, 0x66,	// Char 110 (n)
	0x00, 0x00, 0x00, 0x3C, 0x66, 0x66, 0x66, 0x3C,	// Char 111 (o)
	0x00, 0x00, 0x7C, 0x66, 0x66, 0x7C, 0x60, 0x60,	// Char 112 (p)
	0x00, 0x00, 0x7C, 0xCC, 0xCC, 0x7C, 0x0E, 0x0C,	// Char 113 (q)
	0x00, 0x00, 0x00, 0x6C, 0x70, 0x60, 0x60, 0x60,	// Char 114 (r)
	0x00, 0x00, 0x78, 0x8C, 0x60, 0x18, 0xC4, 0x78,	// Char 115 (s)
	0x00, 0x00, 0x60, 0xF0, 0x60, 0x60, 0x60, 0x38,	// Char 116 (t)
	0x00, 0x00, 0x00, 0x66, 0x66, 0x66, 0x66, 0x3C,	// Char 117 (u)
	0x00, 0x00, 0x00, 0x66, 0x66, 0x66, 0x3C, 0x18,	// Char 118 (v)
	0x00, 0x00, 0x00, 0xC6, 0xC6, 0xD6, 0xFE, 0x6C,	// Char 119 (w)
	0x00, 0x00, 0x00, 0x66, 0x3C, 0x18, 0x3C, 0x66,	// Char 120 (x)
	0x00, 0x00, 0x66, 0x66, 0x3E, 0x06, 0x66, 0x3C,	// Char 121 (y)
	0x00, 0x00, 0x7E, 0x0C, 0x18, 0x30, 0x60, 0x7E,	// Char 122 (z)
	0x00, 0x0C, 0x18, 0x18, 0x30, 0x18, 0x18, 0x0C,	// Char 123 ({)
	0x00, 0x18, 0x18, 0x18, 0x18, 0x18, 0x18, 0x18,	// Char 124 (|)
	0x00, 0x30, 0x18, 0x18, 0x0C, 0x18, 0x18, 0x30,	// Char 125 (})
	0x00, 0x32, 0x4C, 0x00, 0x00, 0x00, 0x00, 0x00,	// Char 126 (~)
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,	// Char 127 (.)
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,	// Char 128 (.)
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,	// Char 129 (.)
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,	// Char 130 (.)
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,	// Char 131 (.)
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,	// Char 132 (.)
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,	// Char 133 (.)
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,	// Char 134 (.)
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,	// Char 135 (.)
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,	// Char 136 (.)
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,	// Char 137 (.)
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,	// Char 138 (.)
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,	// Char 139 (.)
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,	// Char 140 (.)
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,	// Char 141 (.)
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,	// Char 142 (.)
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,	// Char 143 (.)
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,	// Char 144 (.)
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,	// Char 145 (.)
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,	// Char 146 (.)
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,	// Char 147 (.)
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,	// Char 148 (.)
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,	// Char 149 (.)
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,	// Char 150 (.)
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,	// Char 151 (.)
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,	// Char 152 (.)
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,	// Char 153 (.)
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,	// Char 154 (.)
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,	// Char 155 (.)
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,	// Char 156 (.)
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,	// Char 157 (.)
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,	// Char 158 (.)
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,	// Char 159 (.)
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,	// Char 160 (.)
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,	// Char 161 (.)
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,	// Char 162 (.)
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,	// Char 163 (.)
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,	// Char 164 (.)
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,	// Char 165 (.)
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,	// Char 166 (.)
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,	// Char 167 (.)
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,	// Char 168 (.)
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,	// Char 169 (.)
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,	// Char 170 (.)
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,	// Char 171 (.)
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,	// Char 172 (.)
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,	// Char 173 (.)
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,	// Char 174 (.)
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,	// Char 175 (.)
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,	// Char 176 (.)
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,	// Char 177 (.)
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,	// Char 178 (.)
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,	// Char 179 (.)
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,	// Char 180 (.)
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,	// Char 181 (.)
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,	// Char 182 (.)
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,	// Char 183 (.)
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,	// Char 184 (.)
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,	// Char 185 (.)
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,	// Char 186 (.)
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,	// Char 187 (.)
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,	// Char 188 (.)
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,	// Char 189 (.)
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,	// Char 190 (.)
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,	// Char 191 (.)
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,	// Char 192 (.)
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,	// Char 193 (.)
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,	// Char 194 (.)
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,	// Char 195 (.)
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,	// Char 196 (.)
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,	// Char 197 (.)
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,	// Char 198 (.)
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,	// Char 199 (.)
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,	// Char 200 (.)
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,	// Char 201 (.)
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,	// Char 202 (.)
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,	// Char 203 (.)
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,	// Char 204 (.)
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,	// Char 205 (.)
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,	// Char 206 (.)
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,	// Char 207 (.)
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,	// Char 208 (.)
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,	// Char 209 (.)
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,	// Char 210 (.)
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,	// Char 211 (.)
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,	// Char 212 (.)
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,	// Char 213 (.)
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,	// Char 214 (.)
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,	// Char 215 (.)
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,	// Char 216 (.)
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,	// Char 217 (.)
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,	// Char 218 (.)
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,	// Char 219 (.)
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,	// Char 220 (.)
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,	// Char 221 (.)
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,	// Char 222 (.)
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,	// Char 223 (.)
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,	// Char 224 (.)
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,	// Char 225 (.)
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,	// Char 226 (.)
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,	// Char 227 (.)
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,	// Char 228 (.)
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,	// Char 229 (.)
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,	// Char 230 (.)
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,	// Char 231 (.)
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,	// Char 232 (.)
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,	// Char 233 (.)
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,	// Char 234 (.)
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,	// Char 235 (.)
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,	// Char 236 (.)
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,	// Char 237 (.)
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,	// Char 238 (.)
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,	// Char 239 (.)
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,	// Char 240 (.)
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,	// Char 241 (.)
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,	// Char 242 (.)
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,	// Char 243 (.)
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,	// Char 244 (.)
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,	// Char 245 (.)
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,	// Char 246 (.)
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,	// Char 247 (.)
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,	// Char 248 (.)
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,	// Char 249 (.)
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,	// Char 250 (.)
	0x00, 0x00, 0x00, 0x38, 0x38, 0x38, 0x00, 0x00,	// Char 251 (.)
	0x00, 0x7C, 0x82, 0x9A, 0xA2, 0x9A, 0x82, 0x7C,	// Char 252 (.)
	0x00, 0x10, 0x10, 0x10, 0x00, 0x10, 0x10, 0x10,	// Char 253 (.)
	0x00, 0x3E, 0x74, 0x74, 0x34, 0x14, 0x14, 0x14,	// Char 254 (.)
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00	// Char 255 (.)
];



function setup(){
  noCanvas();
  pager.fill(new Array(256));
  RAM.fill(0);
  while(!Halt){
    clock();
  }
}

function clock(){

}