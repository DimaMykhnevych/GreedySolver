import { Component, Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent {
  public displayedColumns: string[] = [' '];
  public dataSource = new MatTableDataSource<number[]>([]);

  @Input() public set data(data: number[][]) {
    this.dataSource = new MatTableDataSource(data);
    this.displayedColumns = [' '];
    Array.from(Array(data[0].length).keys()).map((d) => {
      this.displayedColumns.push((d + 1).toString());
    });
  }

  public editor = {
    // use to change the switch to input
    editPointer: {
      col: -1,
      row: -1,
    },
  };

  public deleteColumn(): void {
    if (this.displayedColumns.length === 1) {
      console.log('Cannot delete all headers.');
      return;
    }

    this.displayedColumns.splice(-1, 1);

    const tempDataSource = [...this.dataSource.data];

    for (let i = 0; i < tempDataSource.length - 1; i++) {
      tempDataSource[i].splice(-1, 1);
    }

    this.dataSource.data = tempDataSource;
  }

  public addColumn(): void {
    this.displayedColumns.push(
      (+this.displayedColumns[this.displayedColumns.length - 1] + 1).toString()
    );
    const tempDataSource = [...this.dataSource.data];

    for (let i = 0; i < tempDataSource.length; i++) {
      tempDataSource[i].push(0);
    }

    this.dataSource.data = tempDataSource;
  }

  public deleteRow(): void {
    if (this.dataSource.data.length === 1) {
      console.log('Cannot delete all rows.');
      return;
    }

    const tempDataSource = [...this.dataSource.data];
    tempDataSource.splice(-1, 1);

    this.dataSource.data = tempDataSource;
  }

  public addRow(): void {
    const tempDataSource = [...this.dataSource.data];
    tempDataSource[tempDataSource.length] = [].concat(
      ...new Array(this.displayedColumns.length - 1).fill([0])
    );
    this.dataSource.data = tempDataSource;
  }

  public switchToInput(rindex: number, cindex: number): void {
    this.editor.editPointer.col = cindex;
    this.editor.editPointer.row = rindex;
  }
}
