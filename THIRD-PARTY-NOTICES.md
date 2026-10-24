# 第三方组件声明 · Third-Party Notices

**Typeset** 的自身代码采用 MIT License（见 [LICENSE](LICENSE)）。

构建产物 `main.js` 中**打包（bundle）**了下列第三方开源库。它们的许可证允许商业使用与再分发，
但要求**保留版权声明与许可文本**，故在此完整收录。

> 为什么必须保留：Typeset 使用 esbuild 将依赖打包进单个 `main.js`。
> 一旦以二进制/打包形式分发，MIT 与 BSD-3-Clause 均要求随附许可证文本。

---

## 1. marked

- **版本**：15.0.12
- **许可证**：MIT
- **用途**：Markdown → HTML 解析
- **仓库**：https://github.com/markedjs/marked

```text
Copyright (c) 2018+, MarkedJS (https://github.com/markedjs/)
Copyright (c) 2011-2018, Christopher Jeffrey (https://github.com/chjj/)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
```

### 1b. Markdown（marked 内含的规范实现来源）

marked 的 LICENSE 文件中同时收录了 John Gruber 的 Markdown 许可：

```text
Copyright (c) 2004, John Gruber
http://daringfireball.net/
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this
  list of conditions and the following disclaimer.
* Redistributions in binary form must reproduce the above copyright notice,
  this list of conditions and the following disclaimer in the documentation
  and/or other materials provided with the distribution.
* Neither the name "Markdown" nor the names of its contributors may be used
  to endorse or promote products derived from this software without specific
  prior written permission.

This software is provided by the copyright holders and contributors "as is"
and any express or implied warranties, including, but not limited to, the
implied warranties of merchantability and fitness for a particular purpose
are disclaimed. In no event shall the copyright owner or contributors be
liable for any direct, indirect, incidental, special, exemplary, or
consequential damages (including, but not limited to, procurement of
substitute goods or services; loss of use, data, or profits; or business
interruption) however caused and on any theory of liability, whether in
contract, strict liability, or tort (including negligence or otherwise)
arising in any way out of the use of this software, even if advised of the
possibility of such damage.
```

---

## 2. highlight.js

- **版本**：11.12.0
- **许可证**：BSD-3-Clause
- **用途**：代码块语法高亮
- **仓库**：https://github.com/highlightjs/highlight.js

```text
BSD 3-Clause License

Copyright (c) 2006, Ivan Sagalaev.
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this
  list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice,
  this list of conditions and the following disclaimer in the documentation
  and/or other materials provided with the distribution.

* Neither the name of the copyright holder nor the names of its
  contributors may be used to endorse or promote products derived from
  this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
```

---

## 3. 仅在开发期使用（不进入 main.js）

以下依赖只用于构建与验证，**不会被分发**，因此无需随附其许可证：

| 组件 | 许可证 | 用途 |
| --- | --- | --- |
| esbuild | MIT | 打包 |
| typescript | Apache-2.0 | 类型检查 |
| obsidian（类型定义） | MIT | API 类型 |
| playwright | Apache-2.0 | 端到端验证 |

---

## 4. 关于 Obsidian 本身

Typeset 是 **Obsidian 的第三方插件**，与 Obsidian 官方（Dynalist Inc.）**无隶属关系**，未获其背书。
"Obsidian" 是其各自权利人的商标，本项目（Typeset）仅在描述兼容性时使用。

插件通过 Obsidian 公开的插件 API 接入，未包含或再分发 Obsidian 自身的任何代码。
